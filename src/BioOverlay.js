import React, { useState, useEffect } from 'react';

export function BioOverlay({ onClose }) {
  const [isVisible, setIsVisible] = useState(false);

  // Trigger fade-in effect on mount
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 300); // Wait for fade-out animation before closing
  };

  return (
    <div 
      className="popup-overlay" 
      onClick={handleClose}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.75)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.3s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none'
      }}
    >
      <div 
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: '#1a1a1a',
          padding: '2rem',
          borderRadius: '8px',
          maxWidth: '500px',
          width: '90%',
          color: 'white',
          position: 'relative',
          transform: `scale(${isVisible ? 1 : 0.95})`,
          opacity: isVisible ? 1 : 0,
          transition: 'transform 0.3s ease-in-out, opacity 0.3s ease-in-out'
        }}
      >
        <button 
          onClick={handleClose}
          style={{
            position: 'absolute',
            right: '1rem',
            top: '1rem',
            background: 'none',
            border: 'none',
            color: 'white',
            fontSize: '1.5rem',
            cursor: 'pointer'
          }}
        >
          ×
        </button>

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>About Me</h2>

        <div style={{ lineHeight: '1.6' }}>
          <p>Hello! I am an independent artist and freelancer with a passion for...</p>
          <p>Currently, I'm working on...</p>
          <p>In my free time, I enjoy...</p>
        </div>
      </div>
    </div>
  );
}

export default BioOverlay;
