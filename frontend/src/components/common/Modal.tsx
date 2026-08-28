import React from 'react';

type ModalProps = {
  open: boolean;
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
};

const Modal: React.FC<ModalProps> = ({ open, title, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="card card-border w-full max-w-2xl bg-base-100 shadow-xl">
        <div className="card-body p-4">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button onClick={onClose} className="btn btn-ghost btn-sm">Close</button>
        </div>
        <div>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
