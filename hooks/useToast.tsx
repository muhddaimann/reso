import { createContext, useContext, useState } from "react";

type Toast = {
  message: string;
  type?: "success" | "error" | "info" | "custom";
  bg?: string;
  fg?: string;
};

const ToastContext = createContext<{
  showToast: (toast: Toast) => void;
  hideToast: () => void;
  toast: Toast | null;
}>({
  showToast: () => {},
  hideToast: () => {},
  toast: null,
});

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<Toast | null>(null);

  const showToast = (newToast: Toast) => setToast(newToast);
  const hideToast = () => setToast(null);

  return (
    <ToastContext.Provider value={{ showToast, hideToast, toast }}>
      {children}
    </ToastContext.Provider>
  );
};
