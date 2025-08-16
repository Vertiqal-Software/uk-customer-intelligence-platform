import React, { createContext, useContext, useCallback, useState, useMemo } from "react";

const ToastContext = createContext(null);

let idCounter = 1;

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const remove = useCallback((id) => setToasts((t) => t.filter((x) => x.id !== id)), []);

  const push = useCallback((type, message, timeout = 3500) => {
    const id = idCounter++;
    setToasts((t) => [...t, { id, type, message }]);
    if (timeout) setTimeout(() => remove(id), timeout);
  }, [remove]);

  const api = useMemo(() => ({
    success: (m, t) => push("success", m, t),
    error: (m, t) => push("error", m, t),
    info: (m, t) => push("info", m, t),
    remove,
  }), [push, remove]);

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div className="fixed bottom-4 right-4 space-y-2 z-50">
        {toasts.map(({ id, type, message }) => (
          <div key={id} className={`px-4 py-3 rounded shadow text-white ${type === "success" ? "bg-green-600" : type === "error" ? "bg-red-600" : "bg-gray-800"}`}>
            <div className="flex items-start gap-3">
              <div className="font-medium capitalize">{type}</div>
              <div className="flex-1">{message}</div>
              <button onClick={() => remove(id)} className="ml-2 text-white/80 hover:text-white">✕</button>
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within <ToastProvider>");
  return ctx;
}
