
"use client";

import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  errorMessage: string | null;
  onClose: () => void;
  isOpen: boolean;

}

const Modal: React.FC<ModalProps> = ({
  errorMessage,
  onClose,
  isOpen,
}) => {

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
          if (event.key === 'Escape') {
            onClose();
          }
        };
        if (isOpen) {
          document.addEventListener('keydown', handleEscape);
          document.body.style.overflow = 'hidden';
        }
        return () => {
          document.removeEventListener('keydown', handleEscape);
          document.body.style.overflow = 'auto';
        };
      }, [isOpen, onClose]);
    
  return createPortal(
    <div className={`fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-70 transition-opacity duration-200 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div className="bg-white rounded-md shadow w-full max-w-sm mx-4 p-4">
        <h2 className="text-base font-medium text-gray-900 mb-3">Error</h2>
        <p className="text-sm text-gray-600 mb-4">{errorMessage}</p>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-2 text-sm font-medium text-white bg-gray-400 rounded-md hover:bg-gray-500 disabled:bg-gray-400/50"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
