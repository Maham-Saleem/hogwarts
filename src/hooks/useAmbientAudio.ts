import { useRef, useCallback, useEffect, useState } from "react";

type AmbientSound = "rain" | "wind" | "fire" | "thunder" | "owl" | "pages" | "bells" | "pad" | "hedwig";

interface AmbientSoundConfig {
  gain?: number;
  duration?: number;
}

const SOUND_CONFIGS: Record<AmbientSound, AmbientSoundConfig> = {
  rain: { gain: 0.035 },
  wind: { gain: 0.02 },
  fire: { gain: 0.03 },
  thunder: { gain: 0.12, duration: 3.5 },
  owl: { gain: 0.04, duration: 1.5 },
  pages: { gain: 0.01, duration: 0.4 },
  bells: { gain: 0.035, duration: 3 },
  pad: { gain: 0.018 },
  hedwig: { gain: 0.06, duration: 25 },
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
    const duration = config.duration || 10;

    stopSound(soundId);
    const allNodes: AudioNode[] = [];
    const sources: AudioBufferSourceNode[] = [];
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    masterGain.gain.linearRampToValueAtTime(config.gain!, ctx.currentTime + 1.5);
    allNodes.push(masterGain);

    if (sound === "rain") {
      const buffer = createNoiseBuffer(ctx, duration + 1);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.playbackRate.value = 0.8;
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 2800;
      f.Q.value = 0.4;
      src.connect(f);
      f.connect(masterGain);
      sources.push(src);
      allNodes.push(src, f);

      // Trickling layer
      const src2 = ctx.createBufferSource();
      src2.buffer = buffer;
      src2.loop = true;
      src2.playbackRate.value = 1.1;
      const f2 = ctx.createBiquadFilter();
      f2.type = "bandpass";
      f2.frequency.value = 2000;
      f2.Q.value = 0.7;
      const g2 = ctx.createGain();
      g2.gain.value = 0.4;
      src2.connect(f2);
      f2.connect(g2);
      g2.connect(masterGain);
      sources.push(src2);
      allNodes.push(src2, f2, g2);

    } else if (sound === "wind") {
      const buffer = createNoiseBuffer(ctx, duration + 1);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.playbackRate.value = 0.6;
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 700;
      f.Q.value = 0.25;
      // LFO sweep
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.1;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 350;
      lfo.connect(lfoG);
      lfoG.connect(f.frequency);
      lfo.start();
      src.connect(f);
      f.connect(masterGain);
      sources.push(src);
      allNodes.push(src, f, lfo, lfoG);

    } else if (sound === "fire") {
      const buffer = createNoiseBuffer(ctx, duration + 1);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      src.loop = true;
      src.playbackRate.value = 0.9;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 400;
      f.Q.value = 1;
      src.connect(f);
      f.connect(masterGain);
      sources.push(src);
      allNodes.push(src, f);

      // Rumble
      const src2 = ctx.createBufferSource();
      src2.buffer = buffer;
      src2.loop = true;
      src2.playbackRate.value = 0.5;
      const f2 = ctx.createBiquadFilter();
      f2.type = "lowpass";
      f2.frequency.value = 180;
      f2.Q.value = 0.4;
      const g2 = ctx.createGain();
      g2.gain.value = 0.5;
      src2.connect(f2);
      f2.connect(g2);
      g2.connect(masterGain);
      sources.push(src2);
      allNodes.push(src2, f2, g2);

    } else if (sound === "thunder") {
      const buffer = createNoiseBuffer(ctx, duration + 1);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 350;
      f.Q.value = 0.15;
      src.connect(f);
      f.connect(masterGain);
      sources.push(src);
      allNodes.push(src, f);

    } else if (sound === "owl") {
      [0, 0.35].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = i === 0 ? 440 : 370;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, ctx.currentTime + delay);
        g.gain.linearRampToValueAtTime(config.gain!, ctx.currentTime + delay + 0.06);
        g.gain.linearRampToValueAtTime(config.gain! * 0.6, ctx.currentTime + delay + 0.25);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 0.55);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.6);
        allNodes.push(osc, g);
      });

    } else if (sound === "bells") {
      [0, 0.5, 1].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = [523, 659, 784][i];
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, ctx.currentTime + delay);
        g.gain.linearRampToValueAtTime(config.gain! * 0.7, ctx.currentTime + delay + 0.04);
        g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + delay + 1.8);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 2);
        allNodes.push(osc, g);
      });

    } else if (sound === "pad") {
      // D minor pad — D3, F3, A3, D4
      [146.83, 174.61, 220, 293.66].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.detune.value = (Math.random() - 0.5) * 6;
        const g = ctx.createGain();
        g.gain.value = 0.3 - i * 0.05;
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 2.5 + Math.random();
        const lfoG = ctx.createGain();
        lfoG.gain.value = 2;
        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);
        lfo.start();
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
        allNodes.push(osc, g, lfo, lfoG);
      });

    } else if (sound === "hedwig") {
      // Hedwig's Theme melody — celesta-like timbre
      // Notes: B4 E5 G5 F#5 E5 B4 A4 F#4 E5 G5 F#5 D#5 F#4 B4 E5 G5 F#5 D#5 F#4 B4 A4
      const melody: [number, number][] = [
        [493.88, 0.35],  // B4
        [659.25, 0.7],   // E5
        [783.99, 0.35],  // G5
        [739.99, 0.7],   // F#5
        [659.25, 0.35],  // E5
        [493.88, 0.7],   // B4
        [440.00, 0.35],  // A4
        [369.99, 0.7],   // F#4
        [329.63, 0.35],  // E4
        [392.00, 0.35],  // G4
        [369.99, 0.7],   // F#4
        [311.13, 0.35],  // D#4
        [369.99, 0.35],  // F#4
        [493.88, 0.7],   // B4
        [659.25, 0.35],  // E5
        [783.99, 0.35],  // G5
        [739.99, 0.7],   // F#5
        [659.25, 0.35],  // E5
        [493.88, 0.7],   // B4
        [440.00, 0.35],  // A4
        [369.99, 0.7],   // F#4
      ];

      let time = ctx.currentTime + 0.5;

      melody.forEach(([freq, dur]) => {
        // Main tone
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;

        // Harmonic for celesta shimmer
        const osc2 = ctx.createOscillator();
        osc2.type = "sine";
        osc2.frequency.value = freq * 2;
        const g2 = ctx.createGain();
        g2.gain.value = 0.15;

        // Third harmonic — bell-like
        const osc3 = ctx.createOscillator();
        osc3.type = "sine";
        osc3.frequency.value = freq * 3;
        const g3 = ctx.createGain();
        g3.gain.value = 0.06;

        const env = ctx.createGain();
        env.gain.setValueAtTime(0, time);
        env.gain.linearRampToValueAtTime(1, time + 0.02);
        env.gain.setValueAtTime(0.7, time + 0.08);
        env.gain.exponentialRampToValueAtTime(0.001, time + dur + 0.4);

        osc.connect(env);
        osc2.connect(g2);
        g2.connect(env);
        osc3.connect(g3);
        g3.connect(env);
        env.connect(masterGain);

        osc.start(time);
        osc.stop(time + dur + 0.5);
        osc2.start(time);
        osc2.stop(time + dur + 0.5);
        osc3.start(time);
        osc3.stop(time + dur + 0.5);

        allNodes.push(osc, osc2, g2, osc3, g3, env);
        time += dur;
      });

    } else if (sound === "pages") {
      const buffer = createNoiseBuffer(ctx, duration + 1);
      const src = ctx.createBufferSource();
      src.buffer = buffer;
      const f = ctx.createBiquadFilter();
      f.type = "highpass";
      f.frequency.value = 3500;
      f.Q.value = 0.5;
      src.connect(f);
      f.connect(masterGain);
      sources.push(src);
      allNodes.push(src, f);
    }

    masterGain.connect(ctx.destination);
    activeNodes.current.set(soundId, { nodes: allNodes, sources });

    if (config.duration) {
      setTimeout(() => stopSound(soundId), (config.duration + 2) * 1000);
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
