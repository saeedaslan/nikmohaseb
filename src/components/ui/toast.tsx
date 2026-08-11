"use client";

import { cn } from "@/lib/utils";
import { createContext, useContext, useState, useEffect } from "react";

type ToastVariant = "default" | "success" | "error" | "warning";

interface Toast {
  id: string;
  message: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id">) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, ...toast }]);
  };
  const dismiss = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (toasts.length > 0) {
      const timer = setTimeout(() => {
        setToasts((prev) => prev.slice(1));
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, dismiss }}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={dismiss} />
    </ToastContext.Provider>
  );
}

function ToastContainer({
  toasts,
  onDismiss,
}: {
  toasts: Toast[];
  onDismiss: (id: string) => void;
}) {
  if (toasts.length === 0) return null;
  return (
    <div
      className="fixed inset-x-0 top-4 z-[100] mx-auto flex w-max list-none flex-col gap-2 px-4"
      role="alert"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </div>
  );
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast;
  onDismiss: (id: string) => void;
}) {
  const variantClasses = {
    default: "bg-surface-card text-text border-border",
    success: "bg-accent-green text-white",
    error: "bg-red-600 text-white",
    warning: "bg-amber-500 text-white",
  };
  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-md border px-4 py-3 text-sm shadow-lg",
        variantClasses[toast.variant],
      )}
    >
      <span className="mt-0.5 flex-1">{toast.message}</span>
      <button
        onClick={() => onDismiss(toast.id)}
        className="rounded p-1 opacity-70 hover:opacity-100"
        aria-label="بستن"
      >
        ✕
      </button>
    </div>
  );
}

export function showToast(
  message: { success?: string; error?: string; warning?: string; info?: string },
  ctx?: ToastContextValue,
) {
  if (ctx) {
    if (message.success) ctx.addToast({ message: message.success, variant: "success" });
    if (message.error) ctx.addToast({ message: message.error, variant: "error" });
    if (message.warning) ctx.addToast({ message: message.warning, variant: "warning" });
    if (message.info) ctx.addToast({ message: message.info, variant: "default" });
  }
}
