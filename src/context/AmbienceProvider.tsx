import type { ReactNode } from "react";
import { createContext, useContext, useEffect, useState, useRef, useCallback } from "react";
import { useAudio } from "./AudioContext";

export type Layer =
  | "wind"
  | "rain"
  | "pad"
  | "choir"
  | "fire"
  | "footsteps"
  | "murmur"
  | "pages"
  | "arpeggio"
  | "birds"
  | "fountain"
  | "clock"
  | "quill"
  | "creak";

export type OneShot = "thunder" | "bells" | "owl" | "door";

interface ActiveLayer {
  gainNode: GainNode;
  nodes: AudioNode[];
  interval?: ReturnType<typeof setInterval>;
}

interface Engine {
  init: () => void;
  start: (id: Layer, vol?: number) => void;
  play: (id: OneShot, vol?: number) => void;
  fade: (id: Layer, to: number, dur?: number) => void;
  stop: (id: Layer, fadeDur?: number) => void;
  stopAll: () => void;
  ready: boolean;
}

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const n = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

const VOLUME: Record<string, number> = {
  wind: 0.028,
  rain: 0.032,
  pad: 0.02,
  choir: 0.012,
  fire: 0.03,
  footsteps: 0.011,
  murmur: 0.005,
  pages: 0.006,
  arpeggio: 0.045,
  birds: 0.05,
  fountain: 0.05,
  clock: 0.03,
  quill: 0.03,
  creak: 0.04,
  thunder: 0.12,
  bells: 0.022,
  owl: 0.03,
  door: 0.05,
};

// Original wonder motif — gentle, generic, not derived from any existing score.
const ARPEGGIO: number[] = [
  440, 523.25, 659.25, 587.33, 523.25, 392, 329.63, 440,
  523.25, 659.25, 783.99, 659.25,
];

const Ctx = createContext<Engine | null>(null);

export function AmbienceProvider({ children }: { children: ReactNode }) {
  const { muted } = useAudio();
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const layers = useRef<Map<string, ActiveLayer>>(new Map());
  const [ready, setReady] = useState(false);

  const ctx = useCallback(() => {
    if (!ctxRef.current || ctxRef.current.state === "closed") {
      ctxRef.current = new AudioContext();
    }
    if (ctxRef.current.state === "suspended") ctxRef.current.resume();
    return ctxRef.current;
  }, []);

  const init = useCallback(() => {
    if (ready) return;
    const c = ctx();
    const master = c.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(c.destination);
    masterRef.current = master;
    setReady(true);
  }, [ready, ctx, muted]);

  const disconnectLayer = useCallback((entry: ActiveLayer) => {
    if (entry.interval) clearInterval(entry.interval);
    entry.nodes.forEach((n) => {
      try { n.disconnect(); } catch {}
    });
  }, []);

  const start = useCallback(
    (id: Layer, vol?: number) => {
      if (!ready) return;
      const c = ctx();
      const master = masterRef.current;
      if (!master) return;
      const existing = layers.current.get(id);
      if (existing) {
        disconnectLayer(existing);
        layers.current.delete(id);
      }

      const g = c.createGain();
      g.gain.value = 0;
      const nodes: AudioNode[] = [g];
      let interval: ReturnType<typeof setInterval> | undefined;

      if (id === "wind") {
        const buf = noiseBuffer(c, 14);
        const s = c.createBufferSource();
        s.buffer = buf;
        s.loop = true;
        s.playbackRate.value = 0.5;
        const lp = c.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 600;
        lp.Q.value = 0.2;
        const lfo = c.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 0.07;
        const lg = c.createGain();
        lg.gain.value = 250;
        lfo.connect(lg);
        lg.connect(lp.frequency);
        lfo.start();
        s.connect(lp);
        lp.connect(g);
        s.start();
        nodes.push(s, lp, lfo, lg);
      } else if (id === "rain") {
        const buf = noiseBuffer(c, 10);
        const s = c.createBufferSource();
        s.buffer = buf;
        s.loop = true;
        s.playbackRate.value = 0.9;
        const lp = c.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 3200;
        lp.Q.value = 0.3;
        s.connect(lp);
        lp.connect(g);
        s.start();
        nodes.push(s, lp);
        const s2 = c.createBufferSource();
        s2.buffer = buf;
        s2.loop = true;
        s2.playbackRate.value = 1.2;
        const bp = c.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 2200;
        bp.Q.value = 0.5;
        const g2 = c.createGain();
        g2.gain.value = 0.3;
        s2.connect(bp);
        bp.connect(g2);
        g2.connect(g);
        s2.start();
        nodes.push(s2, bp, g2);
      } else if (id === "pad") {
        [110, 130.81, 164.81, 220].forEach((f) => {
          const o = c.createOscillator();
          o.type = "sine";
          o.frequency.value = f;
          o.detune.value = (Math.random() - 0.5) * 4;
          const og = c.createGain();
          og.gain.value = 0.3;
          const lfo = c.createOscillator();
          lfo.type = "sine";
          lfo.frequency.value = 0.35 + Math.random() * 0.3;
          const lg = c.createGain();
          lg.gain.value = 1.2;
          lfo.connect(lg);
          lg.connect(o.frequency);
          lfo.start();
          o.connect(og);
          og.connect(g);
          o.start();
          nodes.push(o, og, lfo, lg);
        });
      } else if (id === "choir") {
        [220, 277.18, 329.63, 440].forEach((f) => {
          const o = c.createOscillator();
          o.type = "sine";
          o.frequency.value = f;
          const bp = c.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.value = 800;
          bp.Q.value = 2;
          const og = c.createGain();
          og.gain.value = 0.18;
          const lfo = c.createOscillator();
          lfo.type = "sine";
          lfo.frequency.value = 5.5 + Math.random();
          const lg = c.createGain();
          lg.gain.value = 2.5;
          lfo.connect(lg);
          lg.connect(o.frequency);
          lfo.start();
          o.connect(bp);
          bp.connect(og);
          og.connect(g);
          o.start();
          nodes.push(o, bp, og, lfo, lg);
        });
      } else if (id === "fire") {
        const buf = noiseBuffer(c, 8);
        const s = c.createBufferSource();
        s.buffer = buf;
        s.loop = true;
        s.playbackRate.value = 0.85;
        const bp = c.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 400;
        bp.Q.value = 1;
        s.connect(bp);
        bp.connect(g);
        s.start();
        nodes.push(s, bp);
        const s2 = c.createBufferSource();
        s2.buffer = buf;
        s2.loop = true;
        s2.playbackRate.value = 0.45;
        const lp = c.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 150;
        const g2 = c.createGain();
        g2.gain.value = 0.4;
        s2.connect(lp);
        lp.connect(g2);
        g2.connect(g);
        s2.start();
        nodes.push(s2, lp, g2);
      } else if (id === "murmur") {
        const buf = noiseBuffer(c, 7);
        const s = c.createBufferSource();
        s.buffer = buf;
        s.loop = true;
        s.playbackRate.value = 0.65;
        const bp = c.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 480;
        bp.Q.value = 3;
        const lfo = c.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 3.2;
        const lg = c.createGain();
        lg.gain.value = 0.25;
        const tg = c.createGain();
        tg.gain.value = 1;
        lfo.connect(lg);
        lg.connect(tg.gain);
        lfo.start();
        s.connect(bp);
        bp.connect(tg);
        tg.connect(g);
        s.start();
        nodes.push(s, bp, lfo, lg, tg);
      } else if (id === "footsteps") {
        interval = setInterval(() => {
          const buf = noiseBuffer(c, 0.12);
          const s = c.createBufferSource();
          s.buffer = buf;
          s.playbackRate.value = 0.55 + Math.random() * 0.3;
          const lp = c.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.value = 550 + Math.random() * 200;
          lp.Q.value = 1.5;
          const og = c.createGain();
          const t = c.currentTime;
          og.gain.setValueAtTime(0, t);
          og.gain.linearRampToValueAtTime(0.45, t + 0.015);
          og.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          s.connect(lp);
          lp.connect(og);
          og.connect(g);
          s.start();
          setTimeout(() => {
            try { s.stop(); } catch {}
            try { s.disconnect(); } catch {}
            try { lp.disconnect(); } catch {}
            try { og.disconnect(); } catch {}
          }, 300);
        }, 520);
      } else if (id === "pages") {
        interval = setInterval(() => {
          const buf = noiseBuffer(c, 0.2);
          const s = c.createBufferSource();
          s.buffer = buf;
          s.playbackRate.value = 1.1 + Math.random() * 0.4;
          const hp = c.createBiquadFilter();
          hp.type = "highpass";
          hp.frequency.value = 3800;
          hp.Q.value = 0.5;
          const og = c.createGain();
          const t = c.currentTime;
          og.gain.setValueAtTime(0, t);
          og.gain.linearRampToValueAtTime(0.35, t + 0.02);
          og.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          s.connect(hp);
          hp.connect(og);
          og.connect(g);
          s.start();
          setTimeout(() => {
            try { s.stop(); } catch {}
            try { s.disconnect(); } catch {}
            try { hp.disconnect(); } catch {}
            try { og.disconnect(); } catch {}
          }, 400);
        }, 2600);
      } else if (id === "arpeggio") {
        let noteIndex = 0;
        const pluck = () => {
          const f = ARPEGGIO[noteIndex % ARPEGGIO.length];
          noteIndex++;
          const o = c.createOscillator();
          o.type = "sine";
          o.frequency.value = f;
          const o2 = c.createOscillator();
          o2.type = "sine";
          o2.frequency.value = f * 2;
          const g2 = c.createGain();
          g2.gain.value = 0.12;
          const lp = c.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.value = 2400;
          const og = c.createGain();
          const t = c.currentTime;
          og.gain.setValueAtTime(0, t);
          og.gain.linearRampToValueAtTime(0.8, t + 0.02);
          og.gain.setValueAtTime(0.7, t + 0.1);
          og.gain.exponentialRampToValueAtTime(0.001, t + 1.4);
          o.connect(lp);
          o2.connect(g2);
          g2.connect(lp);
          lp.connect(og);
          og.connect(g);
          o.start(t);
          o2.start(t);
          o.stop(t + 1.6);
          o2.stop(t + 1.6);
          setTimeout(() => {
            try { o.disconnect(); } catch {}
            try { o2.disconnect(); } catch {}
            try { g2.disconnect(); } catch {}
            try { lp.disconnect(); } catch {}
            try { og.disconnect(); } catch {}
          }, 1700);
        };
        pluck();
        interval = setInterval(pluck, 950);
      } else if (id === "birds") {
        const chirp = () => {
          const t = c.currentTime;
          const f0 = 2400 + Math.random() * 900;
          const o = c.createOscillator();
          o.type = "sine";
          o.frequency.setValueAtTime(f0, t);
          o.frequency.linearRampToValueAtTime(f0 * 0.7, t + 0.05);
          o.frequency.linearRampToValueAtTime(f0 * 0.92, t + 0.12);
          const hp = c.createBiquadFilter();
          hp.type = "highpass";
          hp.frequency.value = 1500;
          const og = c.createGain();
          og.gain.setValueAtTime(0, t);
          og.gain.linearRampToValueAtTime(0.45, t + 0.01);
          og.gain.exponentialRampToValueAtTime(0.001, t + 0.16);
          o.connect(hp);
          hp.connect(og);
          og.connect(g);
          o.start(t);
          o.stop(t + 0.2);
          setTimeout(() => {
            try { o.disconnect(); } catch {}
            try { hp.disconnect(); } catch {}
            try { og.disconnect(); } catch {}
          }, 260);
        };
        interval = setInterval(() => {
          chirp();
          if (Math.random() < 0.45) setTimeout(chirp, 120 + Math.random() * 220);
        }, 1500 + Math.random() * 600);
      } else if (id === "fountain") {
        const buf = noiseBuffer(c, 6);
        const s = c.createBufferSource();
        s.buffer = buf;
        s.loop = true;
        s.playbackRate.value = 0.6;
        const bp = c.createBiquadFilter();
        bp.type = "bandpass";
        bp.frequency.value = 1200;
        bp.Q.value = 1.2;
        const lfo = c.createOscillator();
        lfo.type = "sine";
        lfo.frequency.value = 3;
        const lg = c.createGain();
        lg.gain.value = 600;
        lfo.connect(lg);
        lg.connect(bp.frequency);
        lfo.start();
        const og = c.createGain();
        og.gain.value = 0.4;
        s.connect(bp);
        bp.connect(og);
        og.connect(g);
        s.start();
        nodes.push(s, bp, lfo, lg, og);
        interval = setInterval(() => {
          const o = c.createOscillator();
          o.type = "sine";
          o.frequency.value = 1800 + Math.random() * 600;
          const og2 = c.createGain();
          const t = c.currentTime;
          og2.gain.setValueAtTime(0, t);
          og2.gain.linearRampToValueAtTime(0.3, t + 0.005);
          og2.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
          o.connect(og2);
          og2.connect(g);
          o.start(t);
          o.stop(t + 0.1);
          setTimeout(() => {
            try { o.disconnect(); } catch {}
            try { og2.disconnect(); } catch {}
          }, 150);
        }, 700 + Math.random() * 400);
      } else if (id === "clock") {
        let n = 0;
        interval = setInterval(() => {
          const t = c.currentTime;
          const o = c.createOscillator();
          o.type = "triangle";
          o.frequency.value = n % 2 ? 1500 : 1100;
          const og = c.createGain();
          og.gain.setValueAtTime(0, t);
          og.gain.linearRampToValueAtTime(0.22, t + 0.002);
          og.gain.exponentialRampToValueAtTime(0.001, t + 0.04);
          o.connect(og);
          og.connect(g);
          o.start(t);
          o.stop(t + 0.06);
          setTimeout(() => {
            try { o.disconnect(); } catch {}
            try { og.disconnect(); } catch {}
          }, 120);
          n++;
        }, 600);
      } else if (id === "quill") {
        interval = setInterval(() => {
          const buf = noiseBuffer(c, 0.12);
          const s = c.createBufferSource();
          s.buffer = buf;
          s.playbackRate.value = 0.8 + Math.random() * 0.3;
          const bp = c.createBiquadFilter();
          bp.type = "bandpass";
          bp.frequency.value = 3000;
          bp.Q.value = 2;
          const og = c.createGain();
          const t = c.currentTime;
          og.gain.setValueAtTime(0, t);
          og.gain.linearRampToValueAtTime(0.22, t + 0.01);
          og.gain.linearRampToValueAtTime(0.12, t + 0.06);
          og.gain.exponentialRampToValueAtTime(0.001, t + 0.12);
          s.connect(bp);
          bp.connect(og);
          og.connect(g);
          s.start(t);
          setTimeout(() => {
            try { s.stop(); } catch {}
            try { s.disconnect(); } catch {}
            try { bp.disconnect(); } catch {}
            try { og.disconnect(); } catch {}
          }, 180);
        }, 1800 + Math.random() * 700);
      } else if (id === "creak") {
        const groan = () => {
          const t = c.currentTime;
          const o = c.createOscillator();
          o.type = "sawtooth";
          o.frequency.setValueAtTime(170 + Math.random() * 60, t);
          o.frequency.exponentialRampToValueAtTime(115 + Math.random() * 40, t + 0.9);
          o.frequency.exponentialRampToValueAtTime(150 + Math.random() * 40, t + 1.6);
          const lp = c.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.value = 500;
          const og = c.createGain();
          og.gain.setValueAtTime(0, t);
          og.gain.linearRampToValueAtTime(0.4, t + 0.2);
          og.gain.exponentialRampToValueAtTime(0.001, t + 1.8);
          o.connect(lp);
          lp.connect(og);
          og.connect(g);
          o.start(t);
          o.stop(t + 2);
          setTimeout(() => {
            try { o.disconnect(); } catch {}
            try { lp.disconnect(); } catch {}
            try { og.disconnect(); } catch {}
          }, 2100);
        };
        groan();
        interval = setInterval(() => groan(), 6000 + Math.random() * 5000);
      }

      g.connect(master);
      const target = vol ?? VOLUME[id];
      g.gain.setValueAtTime(0, c.currentTime);
      g.gain.linearRampToValueAtTime(target, c.currentTime + 2);
      layers.current.set(id, { gainNode: g, nodes, interval });
    },
    [ready, ctx, disconnectLayer],
  );

  const play = useCallback(
    (id: OneShot, vol?: number) => {
      if (!ready) return;
      const c = ctx();
      const master = masterRef.current;
      if (!master) return;
      const g = c.createGain();
      g.gain.value = vol ?? VOLUME[id];
      g.connect(master);
      const nodes: AudioNode[] = [g];

      if (id === "bells") {
        [0, 0.9].forEach((d, i) => {
          const o = c.createOscillator();
          o.type = "sine";
          o.frequency.value = i === 0 ? 220 : 165;
          const og = c.createGain();
          og.gain.setValueAtTime(0, c.currentTime + d);
          og.gain.linearRampToValueAtTime(0.6, c.currentTime + d + 0.02);
          og.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d + 3.5);
          o.connect(og);
          og.connect(g);
          o.start(c.currentTime + d);
          o.stop(c.currentTime + d + 4);
          nodes.push(o, og);
        });
      } else if (id === "owl") {
        [0, 0.35].forEach((d, i) => {
          const o = c.createOscillator();
          o.type = "sine";
          o.frequency.value = i === 0 ? 440 : 370;
          const og = c.createGain();
          og.gain.setValueAtTime(0, c.currentTime + d);
          og.gain.linearRampToValueAtTime(0.8, c.currentTime + d + 0.04);
          og.gain.linearRampToValueAtTime(0.4, c.currentTime + d + 0.2);
          og.gain.linearRampToValueAtTime(0, c.currentTime + d + 0.45);
          o.connect(og);
          og.connect(g);
          o.start(c.currentTime + d);
          o.stop(c.currentTime + d + 0.55);
          nodes.push(o, og);
        });
      } else if (id === "thunder") {
        const buf = noiseBuffer(c, 3);
        const s = c.createBufferSource();
        s.buffer = buf;
        const lp = c.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 280;
        lp.Q.value = 0.1;
        s.connect(lp);
        lp.connect(g);
        s.start();
        nodes.push(s, lp);
      } else if (id === "door") {
        const buf = noiseBuffer(c, 3);
        const s = c.createBufferSource();
        s.buffer = buf;
        const lp = c.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 320;
        lp.Q.value = 0.5;
        const gN = c.createGain();
        const t = c.currentTime;
        gN.gain.setValueAtTime(0, t);
        gN.gain.linearRampToValueAtTime(0.9, t + 0.15);
        gN.gain.setValueAtTime(0.7, t + 1.1);
        gN.gain.exponentialRampToValueAtTime(0.001, t + 2.6);
        s.connect(lp);
        lp.connect(gN);
        gN.connect(g);
        s.start();
        nodes.push(s, lp, gN);
        const o = c.createOscillator();
        o.type = "sawtooth";
        o.frequency.setValueAtTime(110, c.currentTime);
        o.frequency.exponentialRampToValueAtTime(78, c.currentTime + 2.2);
        const oLp = c.createBiquadFilter();
        oLp.type = "lowpass";
        oLp.frequency.value = 380;
        const oG = c.createGain();
        oG.gain.setValueAtTime(0, t);
        oG.gain.linearRampToValueAtTime(0.4, t + 0.2);
        oG.gain.exponentialRampToValueAtTime(0.001, t + 2.4);
        o.connect(oLp);
        oLp.connect(oG);
        oG.connect(g);
        o.start(t);
        o.stop(t + 2.6);
        nodes.push(o, oLp, oG);
      }

      setTimeout(() => {
        nodes.forEach((n) => {
          try { n.disconnect(); } catch {}
        });
      }, 5000);
    },
    [ready, ctx],
  );

  const fade = useCallback((id: Layer, to: number, dur = 3) => {
    const e = layers.current.get(id);
    if (e && ctxRef.current) {
      e.gainNode.gain.linearRampToValueAtTime(to, ctxRef.current.currentTime + dur);
    }
  }, []);

  const stop = useCallback(
    (id: Layer, fadeDur = 1.5) => {
      const e = layers.current.get(id);
      if (!e) return;
      if (ctxRef.current) {
        e.gainNode.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + fadeDur);
        setTimeout(() => {
          disconnectLayer(e);
          layers.current.delete(id);
        }, fadeDur * 1000 + 100);
      } else {
        disconnectLayer(e);
        layers.current.delete(id);
      }
    },
    [disconnectLayer],
  );

  const stopAll = useCallback(() => {
    layers.current.forEach((_, id) => {
      stop(id as Layer, 0.5);
    });
  }, [stop]);

  // master mute
  useEffect(() => {
    if (masterRef.current && ctxRef.current) {
      masterRef.current.gain.setTargetAtTime(
        muted ? 0 : 1,
        ctxRef.current.currentTime,
        0.05,
      );
    }
  }, [muted]);

  useEffect(() => {
    return () => {
      layers.current.forEach((e) => disconnectLayer(e));
      layers.current.clear();
      try { ctxRef.current?.close(); } catch {}
    };
  }, [disconnectLayer]);

  const value: Engine = { init, start, play, fade, stop, stopAll, ready };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAmbience(): Engine {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAmbience must be used within AmbienceProvider");
  return c;
}
