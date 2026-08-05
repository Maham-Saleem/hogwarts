import { useRef, useCallback, useEffect, useState } from "react";

type AmbientSound = "rain" | "wind" | "fire" | "thunder" | "owl" | "pages" | "bells" | "pad";

interface AmbientSoundConfig {
  gain?: number;
  duration?: number;
}

const SOUND_CONFIGS: Record<AmbientSound, AmbientSoundConfig> = {
  rain: { gain: 0.008 },
  wind: { gain: 0.005 },
  fire: { gain: 0.006 },
  thunder: { gain: 0.04, duration: 3 },
  owl: { gain: 0.015, duration: 1.5 },
  pages: { gain: 0.003, duration: 0.4 },
  bells: { gain: 0.012, duration: 2.5 },
  pad: { gain: 0.004 },
};

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const sampleRate = ctx.sampleRate;
  const length = sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

function createSoftNoise(ctx: AudioContext, duration: number, config: {
  filterType: BiquadFilterType;
  filterFreq: number;
  filterQ: number;
  gain: number;
  loop?: boolean;
  detune?: number;
}) {
  const buffer = createNoiseBuffer(ctx, duration + 1);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  source.loop = config.loop !== false;
  source.playbackRate.value = 0.7 + (config.detune || 0);

  const filter = ctx.createBiquadFilter();
  filter.type = config.filterType;
  filter.frequency.value = config.filterFreq;
  filter.Q.value = config.filterQ;

  const gain = ctx.createGain();
  gain.gain.value = config.gain;

  // Gentle fade in/out
  gain.gain.setValueAtTime(0, ctx.currentTime);
  gain.gain.linearRampToValueAtTime(config.gain, ctx.currentTime + 2);
  gain.gain.linearRampToValueAtTime(config.gain, ctx.currentTime + duration - 2);
  gain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);

  source.connect(filter);
  filter.connect(gain);

  return { source, nodes: [source, filter, gain] };
}

function createOrchestralPad(ctx: AudioContext, duration: number, gain: number) {
  // D minor chord — very Hogwarts
  const frequencies = [146.83, 174.61, 220, 293.66]; // D3, F3, A3, D4
  const nodes: AudioNode[] = [];
  const masterGain = ctx.createGain();
  masterGain.gain.value = 0;
  masterGain.gain.linearRampToValueAtTime(gain, ctx.currentTime + 3);
  masterGain.gain.linearRampToValueAtTime(gain, ctx.currentTime + duration - 3);
  masterGain.gain.linearRampToValueAtTime(0, ctx.currentTime + duration);
  nodes.push(masterGain);

  frequencies.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.value = freq;
    osc.detune.value = (Math.random() - 0.5) * 8;

    const oscGain = ctx.createGain();
    oscGain.gain.value = 0.25 - i * 0.04;

    // Gentle vibrato
    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 2.5 + Math.random() * 1.5;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 2;
    lfo.connect(lfoGain);
    lfoGain.connect(osc.frequency);
    lfo.start();

    osc.connect(oscGain);
    oscGain.connect(masterGain);
    osc.start();
    nodes.push(osc, lfo, oscGain);
  });

  return { nodes };
}

export function useAmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [muted, setMuted] = useState(false);
  const [initialized, setInitialized] = useState(false);
  const activeNodes = useRef<Map<string, { nodes: AudioNode[]; sources?: AudioBufferSourceNode[] }>>(new Map());

  const initAudio = useCallback(() => {
    if (initialized) return;
    try {
      ctxRef.current = new AudioContext();
      ctxRef.current.resume();
      setInitialized(true);
    } catch {}
  }, [initialized]);

  const getContext = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") {
      ctxRef.current.resume();
    }
    return ctxRef.current;
  }, []);

  const stopSound = useCallback((id: string) => {
    const entry = activeNodes.current.get(id);
    if (entry) {
      entry.nodes.forEach((n) => {
        try { n.disconnect(); } catch {}
      });
      entry.sources?.forEach((s) => { try { s.stop(); } catch {} });
      activeNodes.current.delete(id);
    }
  }, []);

  const playSound = useCallback((sound: AmbientSound, id?: string) => {
    if (muted || !initialized) return;
    const ctx = getContext();
    const config = SOUND_CONFIGS[sound];
    const soundId = id || `${sound}-${Date.now()}`;
    const duration = config.duration || 8;

    stopSound(soundId);
    const allNodes: AudioNode[] = [];
    const sources: AudioBufferSourceNode[] = [];
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    allNodes.push(masterGain);

    if (sound === "rain") {
      // Soft rain — high freq filtered, very gentle
      const noise = createSoftNoise(ctx, duration, {
        filterType: "lowpass",
        filterFreq: 2500,
        filterQ: 0.3,
        gain: config.gain!,
        loop: true,
      });
      noise.source.connect(masterGain);
      sources.push(noise.source);
      allNodes.push(...noise.nodes);

      // Secondary layer — trickling
      const trickling = createSoftNoise(ctx, duration, {
        filterType: "bandpass",
        filterFreq: 1800,
        filterQ: 0.8,
        gain: config.gain! * 0.4,
        loop: true,
        detune: 0.15,
      });
      trickling.source.connect(masterGain);
      sources.push(trickling.source);
      allNodes.push(...trickling.nodes);

    } else if (sound === "wind") {
      // Gentle wind — low, sweeping
      const wind = createSoftNoise(ctx, duration, {
        filterType: "lowpass",
        filterFreq: 600,
        filterQ: 0.2,
        gain: config.gain!,
        loop: true,
      });
      // Slow LFO on filter for sweeping
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.08;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = 300;
      lfo.connect(lfoGain);
      lfoGain.connect((wind.nodes[1] as BiquadFilterNode).frequency);
      lfo.start();
      allNodes.push(lfo, lfoGain);

      wind.source.connect(masterGain);
      sources.push(wind.source);
      allNodes.push(...wind.nodes);

    } else if (sound === "fire") {
      // Soft crackling
      const crackle = createSoftNoise(ctx, duration, {
        filterType: "bandpass",
        filterFreq: 350,
        filterQ: 1.2,
        gain: config.gain!,
        loop: true,
      });
      crackle.source.connect(masterGain);
      sources.push(crackle.source);
      allNodes.push(...crackle.nodes);

      // Low rumble
      const rumble = createSoftNoise(ctx, duration, {
        filterType: "lowpass",
        filterFreq: 150,
        filterQ: 0.5,
        gain: config.gain! * 0.5,
        loop: true,
        detune: 0.6,
      });
      rumble.source.connect(masterGain);
      sources.push(rumble.source);
      allNodes.push(...rumble.nodes);

    } else if (sound === "thunder") {
      const thunder = createSoftNoise(ctx, duration, {
        filterType: "lowpass",
        filterFreq: 300,
        filterQ: 0.15,
        gain: config.gain!,
      });
      thunder.source.connect(masterGain);
      sources.push(thunder.source);
      allNodes.push(...thunder.nodes);

    } else if (sound === "owl") {
      // Two-note hoot — more realistic
      [0, 0.35].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = i === 0 ? 440 : 370;

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0, ctx.currentTime + delay);
        oscGain.gain.linearRampToValueAtTime(config.gain!, ctx.currentTime + delay + 0.08);
        oscGain.gain.linearRampToValueAtTime(config.gain! * 0.7, ctx.currentTime + delay + 0.3);
        oscGain.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 0.6);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.7);
        allNodes.push(osc, oscGain);
      });

    } else if (sound === "bells") {
      // Soft chime
      [0, 0.5, 1].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = [523, 659, 784][i]; // C5, E5, G5

        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0, ctx.currentTime + delay);
        oscGain.gain.linearRampToValueAtTime(config.gain! * 0.6, ctx.currentTime + delay + 0.05);
        oscGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 1.5);

        osc.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 1.6);
        allNodes.push(osc, oscGain);
      });

    } else if (sound === "pad") {
      const pad = createOrchestralPad(ctx, duration, config.gain!);
      allNodes.push(...pad.nodes);

    } else if (sound === "pages") {
      const pages = createSoftNoise(ctx, duration, {
        filterType: "highpass",
        filterFreq: 3000,
        filterQ: 0.4,
        gain: config.gain!,
      });
      pages.source.connect(masterGain);
      sources.push(pages.source);
      allNodes.push(...pages.nodes);
    }

    masterGain.connect(ctx.destination);
    activeNodes.current.set(soundId, { nodes: allNodes, sources });

    if (config.duration) {
      setTimeout(() => stopSound(soundId), (config.duration + 1) * 1000);
    }

    return soundId;
  }, [getContext, stopSound, muted, initialized]);

  const playLoop = useCallback((sound: AmbientSound) => {
    return playSound(sound, `loop-${sound}`);
  }, [playSound]);

  const stopLoop = useCallback((sound: AmbientSound) => {
    stopSound(`loop-${sound}`);
  }, [stopSound]);

  const stopAll = useCallback(() => {
    activeNodes.current.forEach((_, id) => stopSound(id));
  }, [stopSound]);

  useEffect(() => {
    return () => {
      activeNodes.current.forEach((entry) => {
        entry.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
        entry.sources?.forEach((s) => { try { s.stop(); } catch {} });
      });
      try { ctxRef.current?.close(); } catch {}
    };
  }, []);

  return { initAudio, playSound, playLoop, stopLoop, stopAll, muted, setMuted, stopSound, initialized };
}
