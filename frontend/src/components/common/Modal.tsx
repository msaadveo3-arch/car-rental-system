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
    <dialog className={`modal ${open ? 'modal-open' : ''}`}>
      <div className="modal-box">
        {(title || onClose) && (
          <form method="dialog" className="flex justify-between items-center mb-4">
            {title && <h3 className="font-bold text-lg">{title}</h3>}
            {onClose && (
              <button onClick={onClose} className="btn btn-sm btn-circle btn-ghost">✕</button>
            )}
          </form>
        )}
        <div>{children}</div>
        <div className="modal-action">
          {onClose && (
            <form method="dialog">
              <button className="btn">Close</button>
            </form>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  );
};

export default Modal;
