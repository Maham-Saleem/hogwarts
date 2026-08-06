import { useRef, useCallback, useEffect, useState } from "react";

type Layer =
  | "wind"
  | "rain"
  | "thunder"
  | "bells"
  | "pad"
  | "choir"
  | "fire"
  | "footsteps"
  | "murmur"
  | "pages"
  | "hedwig"
  | "owl";

interface ActiveLayer {
  nodes: AudioNode[];
  gainNode: GainNode;
}

function noiseBuffer(ctx: AudioContext, seconds: number): AudioBuffer {
  const n = ctx.sampleRate * seconds;
  const buf = ctx.createBuffer(1, n, ctx.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < n; i++) d[i] = Math.random() * 2 - 1;
  return buf;
}

const VOLUME: Record<Layer, number> = {
  wind: 0.03,
  rain: 0.035,
  thunder: 0.12,
  bells: 0.025,
  pad: 0.018,
  choir: 0.01,
  fire: 0.03,
  footsteps: 0.012,
  murmur: 0.005,
  pages: 0.006,
  hedwig: 0.06,
  owl: 0.035,
};

export function useAmbientAudio() {
  const ctxRef = useRef<AudioContext | null>(null);
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
    ctx();
    setReady(true);
  }, [ready, ctx]);

  const start = useCallback(
    (id: Layer, vol?: number) => {
      if (!ready) return;
      const c = ctx();
      const existing = layers.current.get(id);
      if (existing) {
        existing.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
        layers.current.delete(id);
      }

      const master = c.createGain();
      master.gain.value = 0;
      const nodes: AudioNode[] = [master];

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
        lp.connect(master);
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
        lp.connect(master);
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
        g2.connect(master);
        s2.start();
        nodes.push(s2, bp, g2);
      } else if (id === "thunder") {
        const buf = noiseBuffer(c, 3);
        const s = c.createBufferSource();
        s.buffer = buf;
        const lp = c.createBiquadFilter();
        lp.type = "lowpass";
        lp.frequency.value = 280;
        lp.Q.value = 0.1;
        s.connect(lp);
        lp.connect(master);
        s.start();
        nodes.push(s, lp);
      } else if (id === "bells") {
        [0, 0.9].forEach((d, i) => {
          const o = c.createOscillator();
          o.type = "sine";
          o.frequency.value = i === 0 ? 220 : 165;
          const g = c.createGain();
          g.gain.setValueAtTime(0, c.currentTime + d);
          g.gain.linearRampToValueAtTime(0.7, c.currentTime + d + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, c.currentTime + d + 3.5);
          o.connect(g);
          g.connect(master);
          o.start(c.currentTime + d);
          o.stop(c.currentTime + d + 4);
          nodes.push(o, g);
        });
      } else if (id === "pad") {
        [110, 130.81, 164.81, 220].forEach((f) => {
          const o = c.createOscillator();
          o.type = "sine";
          o.frequency.value = f;
          o.detune.value = (Math.random() - 0.5) * 4;
          const g = c.createGain();
          g.gain.value = 0.3;
          const lfo = c.createOscillator();
          lfo.type = "sine";
          lfo.frequency.value = 0.35 + Math.random() * 0.3;
          const lg = c.createGain();
          lg.gain.value = 1.2;
          lfo.connect(lg);
          lg.connect(o.frequency);
          lfo.start();
          o.connect(g);
          g.connect(master);
          o.start();
          nodes.push(o, g, lfo, lg);
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
          const g = c.createGain();
          g.gain.value = 0.18;
          const lfo = c.createOscillator();
          lfo.type = "sine";
          lfo.frequency.value = 5.5 + Math.random();
          const lg = c.createGain();
          lg.gain.value = 2.5;
          lfo.connect(lg);
          lg.connect(o.frequency);
          lfo.start();
          o.connect(bp);
          bp.connect(g);
          g.connect(master);
          o.start();
          nodes.push(o, bp, g, lfo, lg);
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
        bp.connect(master);
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
        g2.connect(master);
        s2.start();
        nodes.push(s2, lp, g2);
      } else if (id === "footsteps") {
        for (let i = 0; i < 14; i++) {
          const buf = noiseBuffer(c, 0.12);
          const s = c.createBufferSource();
          s.buffer = buf;
          s.playbackRate.value = 0.55 + Math.random() * 0.3;
          const lp = c.createBiquadFilter();
          lp.type = "lowpass";
          lp.frequency.value = 550 + Math.random() * 200;
          lp.Q.value = 1.5;
          const g = c.createGain();
          const t = c.currentTime + i * 0.52 + Math.random() * 0.06;
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.55, t + 0.015);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
          s.connect(lp);
          lp.connect(g);
          g.connect(master);
          s.start(t);
          nodes.push(s, lp, g);
        }
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
        tg.connect(master);
        s.start();
        nodes.push(s, bp, lfo, lg, tg);
      } else if (id === "pages") {
        for (let i = 0; i < 4; i++) {
          const buf = noiseBuffer(c, 0.25);
          const s = c.createBufferSource();
          s.buffer = buf;
          s.playbackRate.value = 1.1 + Math.random() * 0.4;
          const hp = c.createBiquadFilter();
          hp.type = "highpass";
          hp.frequency.value = 3800;
          hp.Q.value = 0.5;
          const g = c.createGain();
          const t = c.currentTime + i * 2.8 + Math.random();
          g.gain.setValueAtTime(0, t);
          g.gain.linearRampToValueAtTime(0.4, t + 0.02);
          g.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
          s.connect(hp);
          hp.connect(g);
          g.connect(master);
          s.start(t);
          nodes.push(s, hp, g);
        }
      } else if (id === "hedwig") {
        const notes: [number, number][] = [
          [493.88, 0.4], [659.25, 0.8], [783.99, 0.4], [739.99, 0.8],
          [659.25, 0.4], [493.88, 0.8], [440, 0.4], [369.99, 0.8],
          [329.63, 0.4], [392, 0.4], [369.99, 0.8], [311.13, 0.4],
          [369.99, 0.4], [493.88, 0.8], [659.25, 0.4], [783.99, 0.4],
          [739.99, 0.8], [659.25, 0.4], [493.88, 0.8], [440, 0.4],
          [369.99, 1.2],
        ];
        let t = c.currentTime + 0.3;
        notes.forEach(([freq, dur]) => {
          [1, 2, 3].forEach((h, hi) => {
            const o = c.createOscillator();
            o.type = "sine";
            o.frequency.value = freq * h;
            const g = c.createGain();
            g.gain.setValueAtTime(0, t);
            g.gain.linearRampToValueAtTime(1, t + 0.012);
            g.gain.setValueAtTime(hi === 0 ? 0.75 : hi === 1 ? 0.12 : 0.05, t + 0.05);
            g.gain.exponentialRampToValueAtTime(0.001, t + dur + 0.25);
            o.connect(g);
            g.connect(master);
            o.start(t);
            o.stop(t + dur + 0.4);
            nodes.push(o, g);
          });
          t += dur;
        });
      } else if (id === "owl") {
        [0, 0.35].forEach((d, i) => {
          const o = c.createOscillator();
          o.type = "sine";
          o.frequency.value = i === 0 ? 440 : 370;
          const g = c.createGain();
          g.gain.setValueAtTime(0, c.currentTime + d);
          g.gain.linearRampToValueAtTime(0.9, c.currentTime + d + 0.04);
          g.gain.linearRampToValueAtTime(0.5, c.currentTime + d + 0.2);
          g.gain.linearRampToValueAtTime(0, c.currentTime + d + 0.45);
          o.connect(g);
          g.connect(master);
          o.start(c.currentTime + d);
          o.stop(c.currentTime + d + 0.55);
          nodes.push(o, g);
        });
      }

      master.connect(c.destination);
      const target = vol ?? VOLUME[id];
      master.gain.setValueAtTime(0, c.currentTime);
      master.gain.linearRampToValueAtTime(target, c.currentTime + 2);
      layers.current.set(id, { nodes, gainNode: master });
    },
    [ready, ctx],
  );

  const fade = useCallback(
    (id: Layer, to: number, dur = 3) => {
      const e = layers.current.get(id);
      if (e && ctxRef.current) {
        e.gainNode.gain.linearRampToValueAtTime(to, ctxRef.current.currentTime + dur);
      }
    },
    [],
  );

  const crossfade = useCallback(
    (from: Layer, to: Layer, toVol?: number, dur = 3) => {
      const e = layers.current.get(from);
      if (e && ctxRef.current) {
        e.gainNode.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + dur);
        setTimeout(() => {
          e.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
          layers.current.delete(from);
        }, dur * 1000 + 200);
      }
      start(to, toVol);
    },
    [start],
  );

  const stop = useCallback(
    (id: Layer, fadeDur = 1.5) => {
      const e = layers.current.get(id);
      if (!e) return;
      if (ctxRef.current) {
        e.gainNode.gain.linearRampToValueAtTime(0, ctxRef.current.currentTime + fadeDur);
        setTimeout(() => {
          e.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
          layers.current.delete(id);
        }, fadeDur * 1000 + 100);
      } else {
        e.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
        layers.current.delete(id);
      }
    },
    [],
  );

  const stopAll = useCallback(() => {
    layers.current.forEach((_, id) => {
      stop(id as Layer, 0.5);
    });
  }, [stop]);

  useEffect(() => {
    return () => {
      layers.current.forEach((e) => {
        e.nodes.forEach((n) => { try { n.disconnect(); } catch {} });
      });
      layers.current.clear();
      try { ctxRef.current?.close(); } catch {}
    };
  }, []);

  return { init, start, fade, crossfade, stop, stopAll, ready };
}
