'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, X, CheckCircle2 } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'ยืนยัน',
  cancelText = 'ยกเลิก',
  type = 'danger',
  onConfirm,
  onCancel,
}) => {
  // ป้องกัน scroll เมื่อ dialog เปิด
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // ปิด dialog เมื่อกด ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  const typeStyles = {
    danger: {
      icon: AlertTriangle,
      iconColor: 'text-red-500',
      iconBg: 'bg-red-50',
      confirmBg: 'bg-red-600 hover:bg-red-700',
      confirmShadow: 'shadow-red-500/20',
    },
    warning: {
      icon: AlertTriangle,
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-50',
      confirmBg: 'bg-yellow-600 hover:bg-yellow-700',
      confirmShadow: 'shadow-yellow-500/20',
    },
    info: {
      icon: CheckCircle2,
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-50',
      confirmBg: 'bg-blue-600 hover:bg-blue-700',
      confirmShadow: 'shadow-blue-500/20',
    },
  };

  const styles = typeStyles[type];
  const Icon = styles.icon;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <div
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full transform transition-all animate-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-full ${styles.iconBg} flex items-center justify-center`}>
                <Icon className={`w-6 h-6 ${styles.iconColor}`} />
              </div>
              <h3
                id="dialog-title"
                className="text-xl font-bold text-gray-900"
              >
                {title}
              </h3>
            </div>
            <button
              onClick={onCancel}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              aria-label="ปิด"
            >
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6">
            <p
              id="dialog-description"
              className="text-gray-600 leading-relaxed"
            >
              {message}
            </p>
          </div>

          {/* Footer */}
          <div className="flex gap-3 p-6 border-t border-gray-100 bg-gray-50 rounded-b-2xl">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors"
            >
              {cancelText}
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 ${styles.confirmBg} text-white rounded-xl font-medium transition-all shadow-lg ${styles.confirmShadow} hover:shadow-xl active:scale-95`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ConfirmDialog;
