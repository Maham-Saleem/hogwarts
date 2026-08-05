import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface OwlLetterProps {
  from?: string;
  subject?: string;
  body?: string;
  delay?: number;
  isOpen?: boolean;
  onClose?: () => void;
}

const defaultBody = `Dear Student,

You have been accepted to Hogwarts School of Witchcraft and Wizardry.

Please find enclosed a list of all necessary books and equipment.

Term begins on 1 September.

Yours sincerely,
Minerva McGonagall`;

export function OwlLetter({ body = defaultBody, delay = 0, isOpen: controlledOpen, onClose }: OwlLetterProps) {
  const [internalOpen] = useState(false);
  const isOpen = controlledOpen !== undefined ? controlledOpen : internalOpen;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-abyss/80 backdrop-blur-sm"
            onClick={() => onClose?.()}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Letter */}
          <motion.div
            className="relative z-10 w-full max-w-md"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ delay, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative bg-gradient-to-br from-parchment/6 to-parchment/3 border border-parchment/10 rounded-lg p-6 sm:p-8">
              {/* Wax seal */}
              <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-gradient-to-br from-burgundy/80 to-burgundy-dark/80 flex items-center justify-center" style={{ boxShadow: "0 0 12px rgba(94,27,36,0.3)" }}>
                <span className="text-sm text-gold/60">✉</span>
              </div>

              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-16 h-[1px] bg-gold/20 mx-auto mb-4" />
                <p className="font-cinzel text-gold/60 text-[10px] sm:text-xs tracking-[0.4em] uppercase">
                  Hogwarts School
                </p>
                <p className="font-cinzel text-gold/40 text-[9px] sm:text-[10px] tracking-[0.3em] uppercase mt-0.5">
                  of Witchcraft and Wizardry
                </p>
              </div>

              {/* Body */}
              <div className="font-cormorant text-moonlight/50 text-sm sm:text-base leading-relaxed whitespace-pre-line">
                {body}
              </div>

              {/* Close button */}
              <motion.button
                className="mt-6 w-full py-2 rounded-sm border border-gold/15 bg-gold/5 hover:bg-gold/10 cursor-pointer transition-all"
                onClick={() => onClose?.()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="font-cinzel text-gold/60 text-xs tracking-wider">
                  Continue
                </span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
