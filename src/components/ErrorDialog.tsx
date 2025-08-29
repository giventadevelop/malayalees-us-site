import React from 'react';
import { Modal } from './Modal';
import { FaExclamationTriangle, FaTimes } from 'react-icons/fa';

interface ErrorDialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  details?: string;
  showRetry?: boolean;
  onRetry?: () => void;
}

export function ErrorDialog({
  open,
  onClose,
  title = 'Some unexpected error has occurred',
  message = 'Please try back again later.',
  details,
  showRetry = false,
  onRetry
}: ErrorDialogProps) {
  // Debug logging
  if (open) {
    console.log('[ErrorDialog] Showing error dialog:', { title, message, details });
  }

  return (
    <Modal open={open} onClose={onClose} title={title}>
      <div className="text-center">
        {/* Error Icon */}
        <div className="mx-auto flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
          <FaExclamationTriangle className="text-red-600 text-2xl" />
        </div>

        {/* Error Message - Bigger font and different color */}
        <p className="text-xl text-blue-600 font-medium mb-6">{message}</p>

        {/* Action Buttons - Only Close button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-3 rounded font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center gap-2 text-lg"
          >
            <FaTimes />
            Close
          </button>
        </div>
      </div>
    </Modal>
  );
}
