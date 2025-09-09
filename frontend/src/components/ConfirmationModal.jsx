import React from 'react';
import ReactDOM from 'react-dom'; 
import '../ConfirmationModal.css'; 

const ConfirmationModal = ({ message, onConfirm, onCancel, isVisible }) => {
  if (!isVisible) {
    return null;
  }

  return ReactDOM.createPortal( 
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button onClick={onConfirm} className="modal-button confirm-button">Yes</button>
          <button onClick={onCancel} className="modal-button cancel-button">No</button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmationModal;
