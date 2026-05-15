"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import {
  HiOutlineExclamationCircle,
  HiOutlineCheckCircle,
  HiOutlineX,
} from "react-icons/hi";

// 1. Create the Context
const ToastContext = createContext(null);

// 2. Export the custom hook for easy access
export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

// 3. The Provider component that wraps your app
export function ToastProvider({ children }) {
  const [toast, setToast] = useState(null);

  const showToast = useCallback((message, type = "success") => {
    setToast({ message, type });
  }, []);

  const closeToast = useCallback(() => {
    setToast(null);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={closeToast} />
      )}
    </ToastContext.Provider>
  );
}

// 4. The UI Component (Internal to this file)
function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const isError = type === "error";

  return (
    <div
      className={`fixed top-20 right-4 z-[100] max-w-sm w-full animate-slide-in-right flex items-start gap-3 p-4 rounded-xl shadow-lg border ${
        isError
          ? "bg-[#ffdad6] border-[#ba1a1a]/20 text-[#93000a]"
          : "bg-[#d4f5e4] border-[#00694c]/20 text-[#002115]"
      }`}
      role="alert"
    >
      {isError ? (
        <HiOutlineExclamationCircle className="w-5 h-5 shrink-0 mt-0.5" />
      ) : (
        <HiOutlineCheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
      )}
      <p className="text-sm leading-snug flex-1">{message}</p>
      <button
        onClick={onClose}
        className="shrink-0 hover:opacity-70 transition-opacity"
        aria-label="Dismiss"
      >
        <HiOutlineX className="w-4 h-4" />
      </button>
    </div>
  );
}
