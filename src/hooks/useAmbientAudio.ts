import { useRef, useCallback, useEffect, useState } from "react";

type AmbientLayer = "rain" | "wind" | "fire" | "thunder" | "owl" | "bells" | "pad" | "choir" | "hedwig" | "footsteps" | "pages" | "murmur";

interface LayerConfig {
  gain: number;
  fadeIn?: number;
  fadeOut?: number;
}

const LAYER_DEFAULTS: Record<AmbientLayer, LayerConfig> = {
  rain: { gain: 0.04, fadeIn: 2, fadeOut: 3 },
  wind: { gain: 0.025, fadeIn: 2, fadeOut: 3 },
  fire: { gain: 0.035, fadeIn: 2, fadeOut: 3 },
  thunder: { gain: 0.15, fadeIn: 0.1, fadeOut: 2 },
  owl: { gain: 0.04, fadeIn: 0.05, fadeOut: 0.5 },
  bells: { gain: 0.03, fadeIn: 0.1, fadeOut: 3 },
  pad: { gain: 0.02, fadeIn: 4, fadeOut: 4 },
  choir: { gain: 0.012, fadeIn: 5, fadeOut: 4 },
  hedwig: { gain: 0.07, fadeIn: 0.5, fadeOut: 2 },
  footsteps: { gain: 0.015, fadeIn: 0.3, fadeOut: 0.5 },
  pages: { gain: 0.008, fadeIn: 0.5, fadeOut: 1 },
  murmur: { gain: 0.006, fadeIn: 3, fadeOut: 3 },
};

function createNoiseBuffer(ctx: AudioContext, duration: number): AudioBuffer {
  const length = ctx.sampleRate * duration;
  const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < length; i++) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

export function useAmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
  const [initialized, setInitialized] = useState(false);
  const activeLayers = useRef<Map<string, {
    nodes: AudioNode[];
    source?: AudioBufferSourceNode;
    gainNode: GainNode;
  }>>(new Map());
  const scheduledTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

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

  const stopLayer = useCallback((id: string) => {
    const entry = activeLayers.current.get(id);
    if (entry) {
      const ctx = ctxRef.current;
      if (ctx && entry.gainNode) {
        const fadeOut = 1.5;
        entry.gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + fadeOut);
        setTimeout(() => {
          entry.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
          try { entry.source?.stop(); } catch {}
          activeLayers.current.delete(id);
        }, fadeOut * 1000 + 100);
      } else {
        entry.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
        try { entry.source?.stop(); } catch {}
        activeLayers.current.delete(id);
      }
    }
    const timer = scheduledTimers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      scheduledTimers.current.delete(id);
    }
  }, []);

  const fadeLayer = useCallback((id: string, targetGain: number, duration: number = 2) => {
    const entry = activeLayers.current.get(id);
    if (entry && ctxRef.current) {
      entry.gainNode.gain.linearRampToValueAtTime(targetGain, ctxRef.current.currentTime + duration);
    }
  }, []);

  const playLayer = useCallback((layer: AmbientLayer, id?: string) => {
    if (!initialized) return;
    const ctx = getContext();
    const config = LAYER_DEFAULTS[layer];
    const layerId = id || layer;

    // Stop existing instance
    const existing = activeLayers.current.get(layerId);
    if (existing) {
      existing.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
      try { existing.source?.stop(); } catch {}
      activeLayers.current.delete(layerId);
    }

    const allNodes: AudioNode[] = [];
    const masterGain = ctx.createGain();
    masterGain.gain.value = 0;
    allNodes.push(masterGain);

    if (layer === "rain") {
      const buf = createNoiseBuffer(ctx, 12);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.playbackRate.value = 0.85;
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 2800;
      f.Q.value = 0.3;
      src.connect(f);
      f.connect(masterGain);
      src.start();
      allNodes.push(src, f);

      // Trickling
      const src2 = ctx.createBufferSource();
      src2.buffer = buf;
      src2.loop = true;
      src2.playbackRate.value = 1.15;
      const f2 = ctx.createBiquadFilter();
      f2.type = "bandpass";
      f2.frequency.value = 2000;
      f2.Q.value = 0.6;
      const g2 = ctx.createGain();
      g2.gain.value = 0.35;
      src2.connect(f2);
      f2.connect(g2);
      g2.connect(masterGain);
      src2.start();
      allNodes.push(src2, f2, g2);

    } else if (layer === "wind") {
      const buf = createNoiseBuffer(ctx, 15);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.playbackRate.value = 0.55;
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 650;
      f.Q.value = 0.2;
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 0.08;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 300;
      lfo.connect(lfoG);
      lfoG.connect(f.frequency);
      lfo.start();
      src.connect(f);
      f.connect(masterGain);
      src.start();
      allNodes.push(src, f, lfo, lfoG);

    } else if (layer === "fire") {
      const buf = createNoiseBuffer(ctx, 10);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.playbackRate.value = 0.9;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 420;
      f.Q.value = 1;
      src.connect(f);
      f.connect(masterGain);
      src.start();
      allNodes.push(src, f);

      const src2 = ctx.createBufferSource();
      src2.buffer = buf;
      src2.loop = true;
      src2.playbackRate.value = 0.5;
      const f2 = ctx.createBiquadFilter();
      f2.type = "lowpass";
      f2.frequency.value = 160;
      f2.Q.value = 0.4;
      const g2 = ctx.createGain();
      g2.gain.value = 0.45;
      src2.connect(f2);
      f2.connect(g2);
      g2.connect(masterGain);
      src2.start();
      allNodes.push(src2, f2, g2);

    } else if (layer === "thunder") {
      const buf = createNoiseBuffer(ctx, 4);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      const f = ctx.createBiquadFilter();
      f.type = "lowpass";
      f.frequency.value = 320;
      f.Q.value = 0.12;
      src.connect(f);
      f.connect(masterGain);
      src.start();
      allNodes.push(src, f);

    } else if (layer === "owl") {
      [0, 0.38].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = i === 0 ? 440 : 370;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, ctx.currentTime + delay);
        g.gain.linearRampToValueAtTime(1, ctx.currentTime + delay + 0.05);
        g.gain.linearRampToValueAtTime(0.6, ctx.currentTime + delay + 0.22);
        g.gain.linearRampToValueAtTime(0, ctx.currentTime + delay + 0.5);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 0.6);
        allNodes.push(osc, g);
      });

    } else if (layer === "bells") {
      [0, 0.8].forEach((delay, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = i === 0 ? 220 : 165;
        const g = ctx.createGain();
        g.gain.setValueAtTime(0, ctx.currentTime + delay);
        g.gain.linearRampToValueAtTime(0.8, ctx.currentTime + delay + 0.03);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + delay + 3);
        osc.connect(g);
        g.connect(masterGain);
        osc.start(ctx.currentTime + delay);
        osc.stop(ctx.currentTime + delay + 3.5);
        allNodes.push(osc, g);
      });

    } else if (layer === "pad") {
      // Mystery strings — minor chord, slow evolving
      // Am: A2, C3, E3, A3
      [110, 130.81, 164.81, 220].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.detune.value = (Math.random() - 0.5) * 5;
        const g = ctx.createGain();
        g.gain.value = 0.35 - i * 0.06;
        // Slow vibrato
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.4 + Math.random() * 0.3;
        const lfoG = ctx.createGain();
        lfoG.gain.value = 1.5;
        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);
        lfo.start();
        osc.connect(g);
        g.connect(masterGain);
        osc.start();
        allNodes.push(osc, g, lfo, lfoG);
      });

    } else if (layer === "choir") {
      // Soft choir — "ah" vowel approximation
      [220, 277.18, 329.63, 440].forEach((freq, i) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        // Formant approximation
        const f = ctx.createBiquadFilter();
        f.type = "bandpass";
        f.frequency.value = 800;
        f.Q.value = 2;
        const g = ctx.createGain();
        g.gain.value = 0.2 - i * 0.03;
        const lfo = ctx.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 5.5 + Math.random();
        const lfoG = ctx.createGain();
        lfoG.gain.value = 3;
        lfo.connect(lfoG);
        lfoG.connect(osc.frequency);
        lfo.start();
        osc.connect(f);
        f.connect(g);
        g.connect(masterGain);
        osc.start();
        allNodes.push(osc, f, g, lfo, lfoG);
      });

    } else if (layer === "hedwig") {
      // Hedwig's Theme — celesta timbre
      const melody: [number, number][] = [
        [493.88, 0.4], [659.25, 0.8], [783.99, 0.4], [739.99, 0.8],
        [659.25, 0.4], [493.88, 0.8], [440.00, 0.4], [369.99, 0.8],
        [329.63, 0.4], [392.00, 0.4], [369.99, 0.8], [311.13, 0.4],
        [369.99, 0.4], [493.88, 0.8], [659.25, 0.4], [783.99, 0.4],
        [739.99, 0.8], [659.25, 0.4], [493.88, 0.8], [440.00, 0.4],
        [369.99, 1.2],
      ];
      let t = ctx.currentTime + 0.3;
      melody.forEach(([freq, dur]) => {
        [1, 2, 3].forEach((harmonic, hi) => {
          const osc = ctx.createOscillator();
          osc.type = "sine";
          osc.frequency.value = freq * harmonic;
          const g = ctx.createGain();
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(1, t + 0.015);
          g.gain.setValueAtTime(hi === 0 ? 0.8 : hi === 1 ? 0.15 : 0.06, t + 0.06);
          g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.3);
          osc.connect(g);
          g.connect(masterGain);
          osc.start(t);
          osc.stop(t + dur + 0.5);
          allNodes.push(osc, g);
        });
        t += dur;
      });

    } else if (layer === "footsteps") {
      // Stone footsteps — rhythmic
      for (let i = 0; i < 12; i++) {
        const buf = createNoiseBuffer(ctx, 0.15);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.playbackRate.value = 0.6 + Math.random() * 0.3;
        const f = ctx.createBiquadFilter();
        f.type = "lowpass";
        f.frequency.value = 600 + Math.random() * 200;
        f.Q.value = 1.5;
        const g = ctx.createGain();
        const startT = ctx.currentTime + i * 0.55 + Math.random() * 0.08;
        g.gain.setValueAtTime(0, startT);
        g.gain.linearRampToValueAtTime(0.6, startT + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, startT + 0.12);
        src.connect(f);
        f.connect(g);
        g.connect(masterGain);
        src.start(startT);
        allNodes.push(src, f, g);
      }

    } else if (layer === "pages") {
      for (let i = 0; i < 3; i++) {
        const buf = createNoiseBuffer(ctx, 0.3);
        const src = ctx.createBufferSource();
        src.buffer = buf;
        src.playbackRate.value = 1.2 + Math.random() * 0.4;
        const f = ctx.createBiquadFilter();
        f.type = "highpass";
        f.frequency.value = 4000;
        f.Q.value = 0.5;
        const g = ctx.createGain();
        const startT = ctx.currentTime + i * 2.5 + Math.random();
        g.gain.setValueAtTime(0, startT);
        g.gain.linearRampToValueAtTime(0.5, startT + 0.02);
        g.gain.exponentialRampToValueAtTime(0.001, startT + 0.25);
        src.connect(f);
        f.connect(g);
        g.connect(masterGain);
        src.start(startT);
        allNodes.push(src, f, g);
      }

    } else if (layer === "murmur") {
      // Distant student chatter — filtered noise
      const buf = createNoiseBuffer(ctx, 8);
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.loop = true;
      src.playbackRate.value = 0.7;
      const f = ctx.createBiquadFilter();
      f.type = "bandpass";
      f.frequency.value = 500;
      f.Q.value = 3;
      // Tremolo for speech-like rhythm
      const lfo = ctx.createOscillator();
      lfo.type = "sine";
      lfo.frequency.value = 3.5;
      const lfoG = ctx.createGain();
      lfoG.gain.value = 0.3;
      lfo.connect(lfoG);
      const tremoloGain = ctx.createGain();
      tremoloGain.gain.value = 1;
      lfoG.connect(tremoloGain.gain);
      lfo.start();
      src.connect(f);
      f.connect(tremoloGain);
      tremoloGain.connect(masterGain);
      src.start();
      allNodes.push(src, f, lfo, lfoG, tremoloGain);
    }

    masterGain.connect(ctx.destination);
    activeLayers.current.set(layerId, { nodes: allNodes, source: undefined, gainNode: masterGain });

    // Fade in
    const fadeIn = config.fadeIn || 1;
    masterGain.gain.setValueAtTime(0, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(config.gain, ctx.currentTime + fadeIn);

    return layerId;
  }, [getContext, initialized]);

  const crossfade = useCallback((fromId: string, toLayer: AmbientLayer, toId?: string, duration: number = 3) => {
    if (!ctxRef.current) return;
    const fromEntry = activeLayers.current.get(fromId);
    if (fromEntry) {
      fromEntry.gainNode.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + duration);
      setTimeout(() => {
        fromEntry.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
        try { fromEntry.source?.stop(); } catch {}
        activeLayers.current.delete(fromId);
      }, duration * 1000 + 200);
    }
    playLayer(toLayer, toId);
  }, [playLayer]);

  const scheduleSound = useCallback((layer: AmbientLayer, delayMs: number, id?: string) => {
    const timerId = id || `${layer}-${delayMs}`;
    const timer = setTimeout(() => {
      playLayer(layer, id);
      scheduledTimers.current.delete(timerId);
    }, delayMs);
    scheduledTimers.current.set(timerId, timer);
    return timerId;
  }, [playLayer]);

  const stopAll = useCallback(() => {
    activeLayers.current.forEach((_, id) => stopLayer(id));
    scheduledTimers.current.forEach((timer) => clearTimeout(timer));
    scheduledTimers.current.clear();
  }, [stopLayer]);

  useEffect(() => {
    return () => {
      activeLayers.current.forEach((entry) => {
        entry.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
        try { entry.source?.stop(); } catch {}
      });
      scheduledTimers.current.forEach((timer) => clearTimeout(timer));
      try { ctxRef.current?.close(); } catch {}
    };
  }, []);

  return {
    initAudio,
    playLayer,
    stopLayer,
    fadeLayer,
    crossfade,
    scheduleSound,
    stopAll,
    initialized,
  };
}
