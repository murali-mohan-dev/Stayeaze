import React, { ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  maxWidth = 'lg',
}) => {
  if (!isOpen) return null;

  const widthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '3xl': 'max-w-3xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="min-h-screen px-4 text-center flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#0B132B]/60 backdrop-blur-sm transition-opacity"
          />

          {/* Modal Panel */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`w-full ${widthClasses[maxWidth]} p-6 sm:p-8 my-8 text-left bg-white rounded-3xl shadow-2xl border border-[#EBE3D5] relative z-10`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
              {title && (
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0B132B]">
                  {title}
                </h3>
              )}
              <button
                onClick={onClose}
                className="p-2 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors ml-auto"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>{children}</div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
