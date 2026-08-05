import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "./Sparkles";
import { Particles } from "./Particles";
import { useData } from "@/context/DataContext";

export function LoadingScreen() {
  const { loading } = useData();
  return (
    <AnimatePresence>
      {loading && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-ink-950"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
        >
          <Particles count={30} />
          <Sparkles count={20} />
          <div className="pointer-events-none absolute inset-0 bg-radial-gold" />
          <motion.img
            src="/crest.svg"
            alt=""
            className="h-24 w-24"
            animate={{ y: [0, -8, 0], filter: ["drop-shadow(0 0 8px rgba(212,175,55,0.3))", "drop-shadow(0 0 22px rgba(212,175,55,0.7))", "drop-shadow(0 0 8px rgba(212,175,55,0.3))"] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.h1
            className="mt-6 font-heading text-2xl tracking-widest text-gold-300"
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            animate={{ opacity: 1, letterSpacing: "0.25em" }}
            transition={{ duration: 1.2 }}
          >
            HOGWARTS
          </motion.h1>
          <motion.p
            className="mt-1 font-display text-sm text-silver-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Student Portal
          </motion.p>
          <motion.div
            className="mt-8 h-1 w-56 overflow-hidden rounded-full bg-ink-700"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <motion.div
              className="h-full w-1/2 rounded-full bg-gradient-to-r from-gold-500 to-gold-300"
              initial={{ x: "-100%" }}
              animate={{ x: "200%" }}
              transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
          <p className="mt-6 text-xs uppercase tracking-[0.3em] text-silver-500">
            <motion.span animate={{ opacity: [0.4, 1, 0.4] }} transition={{ duration: 1.8, repeat: Infinity }}>
              Opening the great gates…
            </motion.span>
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}