import { useRef, useCallback, useEffect, useState } from "react";

type AmbientSound = "rain" | "wind" | "fire" | "thunder" | "owl" | "pages" | "bells";

interface AmbientSoundConfig {
  frequency?: number;
  type?: OscillatorType;
  gain?: number;
  duration?: number;
  filter?: { type: BiquadFilterType; frequency: number; Q?: number };
  noise?: boolean;
  noiseGain?: number;
}

const SOUND_CONFIGS: Record<AmbientSound, AmbientSoundConfig> = {
  rain: { noise: true, noiseGain: 0.03, filter: { type: "lowpass", frequency: 3000, Q: 0.5 } },
  wind: { noise: true, noiseGain: 0.02, filter: { type: "lowpass", frequency: 800, Q: 0.3 } },
  fire: { noise: true, noiseGain: 0.025, filter: { type: "bandpass", frequency: 200, Q: 0.8 } },
  thunder: { noise: true, noiseGain: 0.15, filter: { type: "lowpass", frequency: 400, Q: 0.2 }, duration: 3 },
  owl: { frequency: 420, type: "sine", gain: 0.05, duration: 1.2 },
  pages: { noise: true, noiseGain: 0.01, filter: { type: "highpass", frequency: 2000, Q: 0.5 }, duration: 0.3 },
  bells: { frequency: 880, type: "sine", gain: 0.04, duration: 2 },
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
  const activeNodes = useRef<Map<string, { nodes: AudioNode[]; source?: AudioBufferSourceNode }>>(new Map());

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
      try { entry.source?.stop(); } catch {}
      activeNodes.current.delete(id);
    }
  }, []);

  const playSound = useCallback((sound: AmbientSound, id?: string) => {
    if (muted || !initialized) return;
    const ctx = getContext();
    const config = SOUND_CONFIGS[sound];
    const soundId = id || `${sound}-${Date.now()}`;

    stopSound(soundId);
    const nodes: AudioNode[] = [];
    let source: AudioBufferSourceNode | undefined;

    const masterGain = ctx.createGain();
    masterGain.gain.value = config.gain || 1;
    nodes.push(masterGain);

    if (config.noise) {
      const duration = config.duration || 4;
      const buffer = createNoiseBuffer(ctx, duration + 0.5);
      source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = !config.duration;
      source.playbackRate.value = 0.8 + Math.random() * 0.4;

      if (config.filter) {
        const filter = ctx.createBiquadFilter();
        filter.type = config.filter.type;
        filter.frequency.value = config.filter.frequency;
        filter.Q.value = config.filter.Q || 1;
        source.connect(filter);
        filter.connect(masterGain);
        nodes.push(filter, source);
      } else {
        source.connect(masterGain);
        nodes.push(source);
      }

      source.start();
      if (config.duration) {
        source.stop(ctx.currentTime + config.duration);
      }
    } else if (config.frequency) {
      const osc = ctx.createOscillator();
      osc.type = config.type || "sine";
      osc.frequency.value = config.frequency;

      if (config.filter) {
        const filter = ctx.createBiquadFilter();
        filter.type = config.filter.type;
        filter.frequency.value = config.filter.frequency;
        osc.connect(filter);
        filter.connect(masterGain);
        nodes.push(filter);
      } else {
        osc.connect(masterGain);
      }

      nodes.push(osc);
      osc.start();
      if (config.duration) {
        osc.stop(ctx.currentTime + config.duration);
        masterGain.gain.setValueAtTime(config.gain || 0.03, ctx.currentTime);
        masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);
      }
    }

    masterGain.connect(ctx.destination);
    activeNodes.current.set(soundId, { nodes, source });

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
        try { entry.source?.stop(); } catch {}
      });
      try { ctxRef.current?.close(); } catch {}
    };
  }, []);

  return { initAudio, playSound, playLoop, stopLoop, stopAll, muted, setMuted, stopSound, initialized };
}
