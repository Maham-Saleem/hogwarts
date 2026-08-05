import { motion } from "framer-motion";
import { useDiscovery } from "@/context/DiscoveryContext";

export function ProgressTracker() {
  const { discoveredCount, totalSecrets } = useDiscovery();
  const pct = totalSecrets > 0 ? (discoveredCount / totalSecrets) * 100 : 0;
  return (
    <motion.div className="fixed bottom-4 right-4 z-40 bg-surface/65 border border-gold/10 rounded-lg px-3 py-2 backdrop-blur-md"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2, duration: 1 }}>
      <div className="flex items-center gap-2.5">
        <div className="w-1.5 h-1.5 rounded-full bg-gold/40" />
        <div>
          <div className="text-[8px] font-body text-moonlight/30 uppercase tracking-[0.15em]">Secrets</div>
          <div className="text-[10px] font-heading text-gold/60">{discoveredCount} / {totalSecrets}</div>
        </div>
        <div className="w-12 h-1 bg-abyss rounded-full overflow-hidden ml-1">
          <motion.div className="h-full bg-gold/40 rounded-full"
            initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 1.5, ease: "easeOut" }} />
        </div>
      </div>
    </motion.div>
  );
}
