import { motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";

export function ProgressTracker() {
  const { discoveredCount, totalSecrets } = useDiscovery();
  const pct = totalSecrets > 0 ? (discoveredCount / totalSecrets) * 100 : 0;

  return (
    <motion.div
      className="fixed bottom-4 right-4 z-40 bg-surface/80 border border-gold/20 rounded-xl px-4 py-3 backdrop-blur-md shadow-lg"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2 }}
    >
      <div className="flex items-center gap-3">
        <div className="text-gold text-lg">🗝️</div>
        <div>
          <div className="text-xs font-body text-moonlight/60 uppercase tracking-wider">Secrets</div>
          <div className="text-sm font-heading text-gold">
            {discoveredCount} / {totalSecrets}
          </div>
        </div>
        <div className="w-20 h-1.5 bg-abyss rounded-full overflow-hidden ml-2">
          <motion.div
            className="h-full bg-gradient-to-r from-gold-600 to-gold-400 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
}
