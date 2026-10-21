import { useState, Suspense } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useResetPasswordMutation } from "@/lib/services/authService";
import { resetPasswordSchema } from "@/lib/schemas";
import { Eye, EyeOff, CheckCircle2, ArrowRight, ArrowLeft, Shield, Lock, KeyRound, Check } from "lucide-react";
import type { z } from "zod";

type Form = z.infer<typeof resetPasswordSchema>;

function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token        = searchParams.get("token") ?? "";
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const [form, setForm]   = useState<Form>({ token, newPassword: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Partial<Record<keyof Form | "general", string>>>({});
  const [showPwd, setShow]  = useState(false);
  const [done, setDone]     = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const merged = { ...form, token };
    const result = resetPasswordSchema.safeParse(merged);
    if (!result.success) {
      const fe: Partial<Record<keyof Form, string>> = {};
      for (const issue of result.error.issues) {
        const k = issue.path[0] as keyof Form;
        if (!fe[k]) fe[k] = issue.message;
      }
      setErrors(fe); return;
    }

    try {
      await resetPassword({ token: result.data.token, newPassword: result.data.newPassword }).unwrap();
      setDone(true);
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: unknown) {
      const msg = (err as { data?: { message?: string } })?.data?.message ?? "Failed to reset password. The link may have expired.";
      setErrors({ general: msg });
    }
  };

  if (done) {
    return (
        <div className="text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-[rgba(5,223,114,0.1)] border border-[rgba(5,223,114,0.3)] flex items-center justify-center mx-auto">
            <Check size={28} className="text-[#05df72]" />
          </div>
          <div>
            <h2 className="text-[30px] font-bold text-slate-950 dark:text-white mb-2">Password reset!</h2>
            <p className="text-slate-500 dark:text-slate-400 text-base">Your password has been updated. Redirecting you to sign in…</p>
          </div>
        </div>
    );
  }

  return (
      <>
        <div className="space-y-2 mb-8">
          <h2 className="text-[30px] font-bold text-slate-950 dark:text-white leading-9">Set new password</h2>
          <p className="text-slate-500 dark:text-slate-400 text-base">Choose a strong new password for your account.</p>
        </div>

        {!token && (
            <div className="mb-5 p-3.5 rounded-[14px] bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 text-sm text-amber-700 dark:text-amber-300">
              No reset token found. Please use the link from your email.
            </div>
        )}
        {errors.general && (
            <div className="mb-5 p-3.5 rounded-[14px] bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-slate-950 dark:text-white mb-1.5">New password</label>
            <div className="relative">
              <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Min. 8 characters"
                  value={form.newPassword}
                  onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                  className={`w-full h-[46px] px-4 pr-12 rounded-[14px] border text-sm outline-none transition-all bg-white dark:bg-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                      errors.newPassword ? "border-red-400 bg-red-50 dark:bg-red-950" : "border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
                  }`}
              />
              <button type="button" onClick={() => setShow((s) => !s)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white transition-colors">
                {showPwd ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.newPassword && <p className="mt-1 text-xs text-red-500">{errors.newPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-950 dark:text-white mb-1.5">Confirm new password</label>
            <input
                type="password"
                placeholder="Re-enter your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={`w-full h-[46px] px-4 rounded-[14px] border text-sm outline-none transition-all bg-white dark:bg-slate-900 placeholder:text-slate-500 dark:placeholder:text-slate-400 ${
                    errors.confirmPassword ? "border-red-400 bg-red-50 dark:bg-red-950" : "border-slate-200 dark:border-slate-700 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/10"
                }`}
            />
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" disabled={isLoading || !token}
                  className="w-full h-12 rounded-[14px] bg-brand-500 text-white text-base font-semibold hover:bg-brand-600 transition-colors disabled:opacity-60 flex items-center justify-center gap-2 shadow-[0px_10px_15px_0px_rgba(5,150,105,0.25),0px_4px_6px_0px_rgba(5,150,105,0.15)] dark:shadow-[0px_10px_15px_0px_rgba(5,150,105,0.5),0px_4px_6px_0px_rgba(5,150,105,0.3)]">
            {isLoading
                ? <><svg className="animate-spin w-5 h-5" viewBox="0 0 24 24" fill="none"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"/><path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg>Resetting…</>
                : <>Reset password <ArrowRight size={16} /></>
            }
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link to="/login" className="inline-flex items-center gap-1.5 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white font-medium transition-colors">
            <ArrowLeft size={14} /> Back to sign in
          </Link>
        </div>
      </>
  );
}

export default function ResetPasswordPage() {
  return (
      <div className="min-h-screen flex">
        {/* Left Panel - Branding */}
        <div className="hidden lg:flex lg:w-[58%] relative overflow-hidden flex-col justify-between p-12"
             style={{ background: "linear-gradient(131deg, #064E3B 0%, #065F46 50%, #047857 100%)" }}>
          {/* Logo */}
          <Link to="/" aria-label="Ponleu home" className="flex w-fit items-center gap-3 transition-opacity hover:opacity-90">
            <div className="w-10 h-10 rounded-[14px] bg-white/20 flex items-center justify-center">
              <CheckCircle2 size={24} className="text-white" />
            </div>
            <span className="text-white text-2xl font-bold">Ponleu</span>
          </Link>

          {/* Hero */}
          <div className="space-y-8">
            <div>
              <h1 className="text-5xl font-bold text-white leading-tight">Secure your</h1>
              <h1 className="text-5xl font-bold text-[#6EE7B7] leading-tight">account.</h1>
              <p className="text-brand-100 text-lg mt-4 max-w-md">
                Create a strong password to keep your workspace and data safe.
              </p>
            </div>

            {/* Info Cards */}
            <div className="space-y-4">
              {[
                { icon: <Lock size={20} />, title: "Strong passwords", desc: "Use 8+ characters with mixed cases and symbols" },
                { icon: <Shield size={20} />, title: "Encrypted storage", desc: "Your password is securely hashed and encrypted" },
                { icon: <KeyRound size={20} />, title: "One-time link", desc: "Reset links can only be used once for safety" },
              ].map((f) => (
                  <div key={f.title} className="flex items-center gap-4 bg-white/10 border border-white/10 rounded-2xl px-5 py-4">
                    <div className="w-10 h-10 rounded-[14px] bg-[rgba(52,211,153,0.5)] flex items-center justify-center text-white shrink-0">
                      {f.icon}
                    </div>
                    <div>
                      <p className="text-white text-sm font-semibold">{f.title}</p>
                      <p className="text-brand-100 text-sm">{f.desc}</p>
                    </div>
                  </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-8">
            {[
              { val: "10K+", label: "Teams" },
              { val: "50K+", label: "Tasks Daily" },
              { val: "99.9%", label: "Uptime" },
            ].map((s) => (
                <div key={s.label}>
                  <p className="text-white text-2xl font-bold">{s.val}</p>
                  <p className="text-[#6EE7B7] text-sm">{s.label}</p>
                </div>
            ))}
          </div>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 py-10 sm:py-12">
          <div className="w-full max-w-[400px]">
            {/* Mobile Logo */}
            <Link to="/" aria-label="Ponleu home" className="flex items-center gap-3 mb-10 lg:hidden justify-center transition-opacity hover:opacity-90">
              <div className="w-10 h-10 rounded-[14px] bg-brand-500 flex items-center justify-center">
                <CheckCircle2 size={20} className="text-white" />
              </div>
              <span className="text-slate-950 dark:text-white text-xl font-bold">Ponleu</span>
            </Link>

            <Suspense fallback={<div className="text-sm text-slate-500 dark:text-slate-400">Loading…</div>}>
              <ResetPasswordForm />
            </Suspense>
          </div>
        </div>
      </div>
  );
}