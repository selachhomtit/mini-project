import { useRef, useState } from "react";
import { Upload, Loader, Check, X } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

function getInitials(name: string): string {
  return (
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase() || "?"
  );
}

/** Reads the image in the browser and shrinks it to a 256px data URL (no upload, no API). */
function readAsAvatarDataUrl(file: File, maxSize = 256): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      const scale = Math.min(1, maxSize / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext("2d")?.drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL("image/jpeg", 0.85));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this image."));
    };
    img.src = url;
  });
}

export interface AvatarUploadProps {
  currentUrl?: string;
  displayName?: string;
  /** Called with the image as a data URL after it is processed */
  onUpload: (url: string) => Promise<void> | void;
  disabled?: boolean;
  /** Avatar size in px (default 96) */
  size?: number;
}


export default function AvatarUpload({
  currentUrl,
  displayName = "",
  onUpload,
  disabled = false,
  size = 96,
}: AvatarUploadProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "uploading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const avatarUrl = preview ?? currentUrl ?? null;
  const initials = getInitials(displayName);


  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation
    if (!file.type.startsWith("image/")) {
      showError("Please select an image file (JPEG, PNG, WEBP, …)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      showError("File must be smaller than 5 MB");
      return;
    }

    // Optimistic local preview
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);
    setStatus("uploading");
    setErrorMsg("");

    try {
      const dataUrl = await readAsAvatarDataUrl(file);

      // Hand the image up to the parent
      await onUpload(dataUrl);

      setPreview(dataUrl);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (err: unknown) {
      setPreview(null); // revert optimistic preview
      showError(getErrorMessage(err, "Upload failed. Please try again."));
    } finally {
      URL.revokeObjectURL(objectUrl);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  function showError(msg: string) {
    setStatus("error");
    setErrorMsg(msg);
    setTimeout(() => setStatus("idle"), 4000);
  }

  const isUploading = status === "uploading";
  const isDisabled = disabled || isUploading;

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex flex-col gap-2">
      {/* Avatar + upload trigger */}
      <div className="relative inline-block" style={{ width: size, height: size }}>
        {/* Avatar circle */}
        <div
          className="rounded-full overflow-hidden bg-slate-200 dark:bg-slate-700 flex items-center justify-center text-slate-900 dark:text-white font-bold border-2 border-slate-300 dark:border-slate-600 select-none"
          style={{ width: size, height: size, fontSize: size * 0.28 }}
        >
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={displayName}
              className="w-full h-full object-cover"
              draggable={false}
            />
          ) : (
            initials
          )}
        </div>

        {/* Upload button badge */}
        <button
          type="button"
          onClick={() => !isDisabled && fileRef.current?.click()}
          disabled={isDisabled}
          aria-label="Upload profile photo"
          className={[
            "absolute -bottom-1 -right-1 rounded-full p-1.5 border",
            "bg-white dark:bg-slate-800",
            "border-slate-300 dark:border-slate-600",
            "hover:border-emerald-400 dark:hover:border-emerald-500",
            "transition-colors shadow-sm",
            isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer",
          ].join(" ")}
          style={{ width: size * 0.33, height: size * 0.33 }}
        >
          {isUploading ? (
            <Loader
              className="animate-spin text-slate-500"
              style={{ width: "100%", height: "100%" }}
            />
          ) : (
            <Upload
              className="text-slate-500 dark:text-slate-400"
              style={{ width: "100%", height: "100%" }}
            />
          )}
        </button>

        {/* Hidden file input */}
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
          disabled={isDisabled}
        />
      </div>

      {/* Status messages */}
      {status === "error" && (
        <p className="flex items-center gap-1.5 text-xs text-red-600 dark:text-red-400">
          <X size={12} />
          {errorMsg}
        </p>
      )}
      {status === "success" && (
        <p className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400">
          <Check size={12} />
          Photo updated!
        </p>
      )}
      {status === "uploading" && (
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Uploading…
        </p>
      )}
    </div>
  );
}