/* Styled replacements for window.confirm / window.alert, rendered by <FeedbackProvider>:
 *   if (await confirmDialog({ title: "Delete this task?" })) { ... }
 *   toast.success("Saved");  toast.error("Something went wrong");
 * Both are no-ops until the provider is mounted.
 */

export type ConfirmOptions = {
  title: string;
  description?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  /** "danger" (default) for destructive actions, "default" otherwise. */
  tone?: "danger" | "default";
};

export type ToastKind = "success" | "error" | "info";
export type ToastItem = { id: number; kind: ToastKind; message: string; description?: string };

type Handlers = {
  confirm: (opts: ConfirmOptions) => Promise<boolean>;
  toast: (t: Omit<ToastItem, "id">) => void;
};

let handlers: Handlers | null = null;

/** Called by FeedbackProvider on mount (and with null on unmount). */
export function registerFeedback(h: Handlers | null) {
  handlers = h;
}

export function confirmDialog(opts: ConfirmOptions): Promise<boolean> {
  return handlers ? handlers.confirm(opts) : Promise.resolve(false);
}

const show = (kind: ToastKind) => (message: string, description?: string) =>
  handlers?.toast({ kind, message, description });

export const toast = {
  success: show("success"),
  error: show("error"),
  info: show("info"),
};
