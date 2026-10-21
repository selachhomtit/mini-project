import * as React from "react";
import { AlertDialog } from "radix-ui";
import { AlertTriangle, CheckCircle2, Info, X, XCircle } from "lucide-react";

import {
  registerFeedback,
  type ConfirmOptions,
  type ToastItem,
  type ToastKind,
} from "@/lib/feedback";

/** Renders the dialogs and toasts requested through confirmDialog() / toast() in @/lib/feedback. */

const TOAST_DURATION = 3500;

const TOAST_STYLE: Record<ToastKind, { icon: React.ReactNode; bar: string }> = {
  success: { icon: <CheckCircle2 size={18} className="text-brand-500" />, bar: "bg-brand-500" },
  error:   { icon: <XCircle size={18} className="text-red-500" />,       bar: "bg-red-500" },
  info:    { icon: <Info size={18} className="text-sky-500" />,          bar: "bg-sky-500" },
};

export default function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const [confirm, setConfirm] = React.useState<
    (ConfirmOptions & { resolve: (ok: boolean) => void }) | null
  >(null);
  const [toasts, setToasts] = React.useState<ToastItem[]>([]);

  const dismiss = React.useCallback((id: number) => {
    setToasts((list) => list.filter((t) => t.id !== id));
  }, []);

  React.useEffect(() => {
    registerFeedback({
      confirm: (opts) => new Promise((resolve) => setConfirm({ ...opts, resolve })),
      toast: (t) => {
        const id = Date.now() + Math.random();
        setToasts((list) => [...list.slice(-3), { ...t, id }]);
        setTimeout(() => dismiss(id), TOAST_DURATION);
      },
    });
    return () => registerFeedback(null);
  }, [dismiss]);

  const close = (ok: boolean) => {
    confirm?.resolve(ok);
    setConfirm(null);
  };

  const danger = (confirm?.tone ?? "danger") === "danger";

  return (
    <>
      {children}

      {/* Confirm dialog */}
      <AlertDialog.Root open={!!confirm} onOpenChange={(open) => { if (!open) close(false); }}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 z-100 bg-slate-950/40 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0" />
          <AlertDialog.Content className="fixed left-1/2 top-1/2 z-101 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-900 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
            <div className="flex flex-col items-center text-center">
              <div
                className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${
                  danger ? "bg-red-50 text-red-500 dark:bg-red-950/50" : "bg-brand-50 text-brand-500 dark:bg-brand-500/15"
                }`}
              >
                {danger ? <AlertTriangle size={22} /> : <Info size={22} />}
              </div>
              <AlertDialog.Title className="text-base font-bold text-slate-900 dark:text-white">
                {confirm?.title}
              </AlertDialog.Title>
              <AlertDialog.Description className="mt-1.5 text-sm text-slate-500 dark:text-slate-400">
                {confirm?.description ?? (danger ? "This action can't be undone." : "")}
              </AlertDialog.Description>
            </div>
            <div className="mt-6 flex gap-3">
              <AlertDialog.Cancel asChild>
                <button className="h-10 flex-1 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800">
                  {confirm?.cancelLabel ?? "Cancel"}
                </button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild>
                <button
                  onClick={(e) => { e.preventDefault(); close(true); }}
                  className={`h-10 flex-1 rounded-xl text-sm font-semibold text-white shadow-sm transition-colors ${
                    danger ? "bg-red-500 hover:bg-red-600 shadow-red-500/30" : "bg-brand-500 hover:bg-brand-600 shadow-brand-500/30"
                  }`}
                >
                  {confirm?.confirmLabel ?? (danger ? "Delete" : "Confirm")}
                </button>
              </AlertDialog.Action>
            </div>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>

      {/* Toasts */}
      <div
        aria-live="polite"
        className="pointer-events-none fixed inset-x-4 bottom-4 z-110 flex flex-col items-center gap-2 sm:inset-x-auto sm:right-4 sm:items-end"
      >
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className="pointer-events-auto relative flex w-full max-w-sm items-start gap-3 overflow-hidden rounded-xl border border-slate-200 bg-white py-3 pl-4 pr-3 shadow-lg shadow-slate-900/10 animate-in fade-in-0 slide-in-from-bottom-2 dark:border-slate-700 dark:bg-slate-900"
          >
            <span className={`absolute inset-y-0 left-0 w-1 ${TOAST_STYLE[t.kind].bar}`} />
            <span className="mt-0.5 shrink-0">{TOAST_STYLE[t.kind].icon}</span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">{t.message}</p>
              {t.description && (
                <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{t.description}</p>
              )}
            </div>
            <button
              onClick={() => dismiss(t.id)}
              aria-label="Dismiss"
              className="shrink-0 rounded-md p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600 dark:hover:bg-slate-800"
            >
              <X size={14} />
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
