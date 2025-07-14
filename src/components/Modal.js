import React from 'react';

const modalStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  background: 'rgba(0,0,0,0.5)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000,
};

const contentStyle = {
  background: '#222',
  borderRadius: 12,
  padding: 32,
  minWidth: 320,
  maxWidth: '90vw',
  boxShadow: '0 8px 32px rgba(0,0,0,0.25)',
};

const Modal = ({ children, onClose }) => {
  return (
    <div style={modalStyle} onClick={onClose}>
      <div style={contentStyle} onClick={e => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export default Modal; 