'use client';

import { Modal } from '../Modal';
import { CheckCircle } from 'lucide-react';

interface SuccessDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  message: string;
  buttonText?: string;
}

export function SuccessDialog({ 
  open, 
  onClose, 
  title, 
  message, 
  buttonText = "OK" 
}: SuccessDialogProps) {
  console.log('[SUCCESS DIALOG] Component called with open:', open, 'title:', title);
  
  if (!open) {
    console.log('[SUCCESS DIALOG] Not rendering because open is false');
    return null;
  }
  
  console.log('[SUCCESS DIALOG] Rendering dialog');

  return (
    <Modal open={open} onClose={onClose} title={undefined}>
      <div className="text-center">
        <div className="flex flex-col items-center space-y-4">
          {/* Success Icon */}
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          {/* Title */}
          <h3 className="text-xl font-semibold text-gray-800">
            {title}
          </h3>
          
          {/* Message */}
          <p className="text-gray-600 max-w-sm">
            {message}
          </p>
          
          {/* Action Button */}
          <button
            onClick={onClose}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-2"
          >
            <CheckCircle className="w-4 h-4" />
            {buttonText}
          </button>
        </div>
      </div>
    </Modal>
  );
}

