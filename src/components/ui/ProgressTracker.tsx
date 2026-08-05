import { motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";

export function ProgressTracker() {
  const { discoveredCount, totalSecrets } = useDiscovery();
  const pct = totalSecrets > 0 ? (discoveredCount / totalSecrets) * 100 : 0;
  return (
    <motion.div className="fixed bottom-4 right-4 z-40 bg-surface/75 border border-gold/15 rounded-xl px-4 py-2.5 backdrop-blur-md shadow-lg"
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 2 }}>
      <div className="flex items-center gap-3">
        <span className="text-gold text-base">🗝️</span>
        <div>
          <div className="text-[9px] font-body text-moonlight/40 uppercase tracking-[0.15em]">Secrets</div>
          <div className="text-xs font-heading text-gold">{discoveredCount} / {totalSecrets}</div>
        </div>
        <div className="w-16 h-1.5 bg-abyss rounded-full overflow-hidden ml-1">
          <motion.div className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
        </div>
      </div>
    </motion.div>
  );
}
