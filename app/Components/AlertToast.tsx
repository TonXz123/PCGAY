'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertToastProps {
  message: string;
  type?: AlertType;
  duration?: number;
  onClose?: () => void;
}

const AlertToast: React.FC<AlertToastProps> = ({
  message,
  type = 'info',
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose?.(), 300); // รอ animation เสร็จ
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  const typeStyles = {
    success: {
      icon: CheckCircle2,
      bg: 'bg-green-50',
      border: 'border-green-200',
      text: 'text-green-800',
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100',
    },
    error: {
      icon: XCircle,
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      iconColor: 'text-red-500',
      iconBg: 'bg-red-100',
    },
    warning: {
      icon: AlertCircle,
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-100',
    },
    info: {
      icon: Info,
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100',
    },
  };

  const styles = typeStyles[type];
  const Icon = styles.icon;

  if (!isVisible) return null;

  return (
    <div
      className={`fixed top-4 right-4 z-[100] ${styles.bg} ${styles.border} border rounded-xl shadow-lg p-4 min-w-[300px] max-w-md transform transition-all duration-300 animate-in slide-in-from-right fade-in`}
      role="alert"
    >
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-full ${styles.iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-5 h-5 ${styles.iconColor}`} />
        </div>
        <div className="flex-1">
          <p className={`${styles.text} font-medium text-sm`}>{message}</p>
        </div>
        <button
          onClick={() => {
            setIsVisible(false);
            setTimeout(() => onClose?.(), 300);
          }}
          className={`p-1 ${styles.text} hover:opacity-70 transition-opacity shrink-0`}
          aria-label="ปิด"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
};

// Hook สำหรับแสดง Alert Toast
export const useAlert = () => {
  const [alerts, setAlerts] = useState<Array<{ id: string; message: string; type: AlertType }>>([]);

  const showAlert = (message: string, type: AlertType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setAlerts((prev) => [...prev, { id, message, type }]);
    return id;
  };

  const removeAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const AlertContainer = () => (
    <div className="fixed top-4 right-4 z-[100] space-y-2">
      {alerts.map((alert) => (
        <AlertToast
          key={alert.id}
          message={alert.message}
          type={alert.type}
          onClose={() => removeAlert(alert.id)}
        />
      ))}
    </div>
  );

  return { showAlert, AlertContainer };
};

export default AlertToast;
