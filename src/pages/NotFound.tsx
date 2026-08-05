import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Castle } from "lucide-react";
import { PageTransition } from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/Button";

export function NotFound() {
  return (
    <PageTransition>
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <motion.img
          src="/crest.svg"
          alt=""
          className="h-24 w-24 opacity-60"
          animate={{ rotate: [0, 3, -3, 0], y: [0, -6, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        />
        <h1 className="mt-6 font-heading text-6xl text-gold-300">404</h1>
        <p className="mt-3 font-display text-xl italic text-silver-400">This corridor does not exist.</p>
        <p className="mt-2 max-w-sm text-sm text-silver-500">
          The staircases move on their own, and it seems you've wandered past a wall that should not be walked through.
        </p>
        <div className="mt-8 flex gap-3">
          <Link to="/" className="btn-focus"><Button icon={<Castle className="h-4 w-4" />}>Return to the Great Hall</Button></Link>
        </div>
      </div>
    </PageTransition>
  );
}