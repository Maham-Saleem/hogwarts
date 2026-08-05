import { motion, AnimatePresence } from "framer-motion";

interface ScrollDialogProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function ScrollDialog({ isOpen, onClose, children }: ScrollDialogProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8 }}
        >
          {/* Backdrop - dark stone */}
          <motion.div
            className="absolute inset-0"
            style={{ backgroundColor: "rgba(14,13,11,0.85)" }}
            onClick={onClose}
          />

          {/* Dialog - unfolding parchment */}
          <motion.div
            className="relative z-10 max-w-md w-full"
            initial={{ opacity: 0, scaleY: 0, originY: 0 }}
            animate={{ opacity: 1, scaleY: 1 }}
            exit={{ opacity: 0, scaleY: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div
              className="relative rounded-sm overflow-hidden"
              style={{
                background: "linear-gradient(135deg, rgba(232,220,196,0.06), rgba(232,220,196,0.03))",
                border: "1px solid rgba(139,105,20,0.1)",
                boxShadow: "0 4px 24px rgba(0,0,0,0.5), inset 0 0 40px rgba(139,105,20,0.03)",
              }}
            >
              {/* Wax seal decoration */}
              <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center"
                style={{
                  background: "radial-gradient(circle, rgba(94,27,36,0.6), rgba(74,21,32,0.8))",
                  boxShadow: "0 0 8px rgba(94,27,36,0.3)",
                }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "rgba(212,175,55,0.3)" }} />
              </div>

              <div className="p-6">{children}</div>

              <div className="px-6 py-3 flex justify-end" style={{ borderTop: "1px solid rgba(139,105,20,0.06)" }}>
                <button
                  onClick={onClose}
                  className="px-4 py-1.5 rounded cursor-pointer transition-all duration-500"
                  style={{
                    background: "linear-gradient(180deg, rgba(61,43,31,0.2), rgba(42,29,20,0.3))",
                    border: "1px solid rgba(139,105,20,0.1)",
                    color: "rgba(212,195,160,0.4)",
                  }}
                >
                  <span className="font-cinzel text-[10px] tracking-wider">CLOSE</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
