import React, { createContext, useState } from 'react';

interface IToastState {
  show: boolean;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface IToastContextType {
  show: boolean;
  message: string;
  type: IToastState['type'];
  showToast: (message: string, type?: IToastState['type']) => void;
  hideToast: () => void;
}

const ToastContext = createContext<IToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<IToastState>({
    show: false,
    message: '',
    type: 'success',
  });

  const showToast = (message: string, type: IToastState['type'] = 'success') => {
    setState({ show: true, message, type });
  };

  const hideToast = () => {
    setState((prev) => ({ ...prev, show: false }));
  };

  return (
    <ToastContext.Provider
      value={{
        show: state.show,
        message: state.message,
        type: state.type,
        showToast,
        hideToast,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export { ToastContext };
