import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { motion } from "framer-motion";
import { Eye, EyeOff, Feather, Lock, Mail, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { Particles } from "@/components/animations/Particles";
import { Spirits } from "./LoginBackgrounds";
import { Button } from "@/components/ui/Button";

interface LoginForm {
  email: string;
  password: string;
  remember: boolean;
}

export function Login() {
  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    defaultValues: { email: "seraphina@hogwarts.edu", password: "lumos", remember: true },
  });

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      await login(data.email);
      toast.success("Welcome back to Hogwarts", `The gates open for ${data.email}`);
      navigate("/");
    } catch {
      toast.error("Failed to sign in", "The wards refused your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-950 px-4">
      <Particles count={40} />
      <Spirits />
      <div className="pointer-events-none absolute inset-0 bg-radial-gold" />

      <div className="relative z-10 grid w-full max-w-4xl overflow-hidden rounded-3xl border border-gold/15 shadow-panel sm:grid-cols-2">
        {/* Left visual panel */}
        <div className="relative hidden flex-col justify-end overflow-hidden p-8 sm:flex" aria-hidden>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-wine-400/40 via-ink-900 to-emerald2-400/30" />
          <FloatingOrbs />
          <div className="relative">
            <img src="/crest.svg" alt="" className="mb-6 h-16 w-16 drop-shadow-[0_0_16px_rgba(212,175,55,0.5)]" />
            <h2 className="font-display text-3xl leading-tight text-beige-100">
              Where magic and learning intertwine.
            </h2>
            <p className="mt-3 max-w-xs text-sm text-silver-400">
              Enter your credentials to step into a world of enchantment, discovery and endless wonder.
            </p>
            <div className="gold-divider mt-6" />
            <p className="mt-4 flex items-center gap-2 text-xs text-silver-500">
              <Feather className="h-3.5 w-3.5 text-gold-400" /> Live waxing crescent · Clear skies over the Black Lake
            </p>
          </div>
        </div>

        {/* Login form panel */}
        <div className="glass-strong p-8 sm:p-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-start sm:items-center sm:text-center"
          >
            <img src="/crest.svg" alt="Hogwarts crest" className="mb-4 h-14 w-14 sm:hidden" />
            <p className="font-heading text-xs uppercase tracking-[0.3em] text-gold-400">Welcome back</p>
            <h1 className="mt-2 font-heading text-2xl text-beige-100">Enter the Gates</h1>
            <p className="mt-1 text-sm text-silver-500">Sign in to your student account</p>
          </motion.div>

          <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-4" noValidate>
            <div>
              <label htmlFor="email" className="mb-1.5 block text-xs font-medium text-silver-400">
                Owl Post Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-500" />
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="input-base pl-10"
                  {...register("email", { required: "An address is required", pattern: { value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/, message: "That doesn't look like a valid address" } })}
                />
              </div>
              {errors.email && <p className="mt-1 text-xs text-wine-300">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-xs font-medium text-silver-400">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-silver-500" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="input-base pl-10 pr-10"
                  {...register("password", { required: "A password is required", minLength: { value: 4, message: "Too short for any proper ward" } })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="btn-focus absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-silver-500 hover:text-beige-100"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-xs text-wine-300">{errors.password.message}</p>}
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-silver-500">
                <input type="checkbox" className="h-4 w-4 accent-[#D4AF37]" {...register("remember")} />
                Remember me
              </label>
              <button type="button" className="btn-focus rounded text-silver-400 transition hover:text-gold-300">
                Forgot password?
              </button>
            </div>

            <Button type="submit" loading={loading} size="lg" className="w-full" icon={!loading ? <Sparkles className="h-4 w-4" /> : undefined}>
              {loading ? "Unlocking the gates…" : "Sign In"}
            </Button>
          </form>

          <p className="mt-6 text-center text-xs text-silver-600">
            A fan-made, non-commercial concept. No official art or assets are used.
          </p>
        </div>
      </div>
    </div>
  );
}

function FloatingOrbs() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {[
        { left: "10%", top: "15%", c: "#D4AF37" },
        { left: "75%", top: "30%", c: "#C0C0C0" },
        { left: "40%", top: "65%", c: "#1E5631" },
      ].map((o, i) => (
        <motion.span
          key={i}
          className="absolute h-10 w-10 rounded-full blur-xl"
          style={{ left: o.left, top: o.top, background: o.c, opacity: 0.35 }}
          animate={{ y: [0, -20, 0], opacity: [0.25, 0.5, 0.25] }}
          transition={{ duration: 7 + i * 2, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
    </div>
  );
}