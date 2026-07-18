import React from 'react';

export default function DeleteConfirmModal({ isOpen, onClose, onConfirm, title, message }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl w-full max-w-sm shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-2">{title || 'Delete Record?'}</h3>
        <p className="text-slate-400 text-sm mb-6">
          {message || 'Are you sure you want to delete this record? This action cannot be undone.'}
        </p>
        <div className="flex gap-3 justify-end">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-500 shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-all"
          >
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}
