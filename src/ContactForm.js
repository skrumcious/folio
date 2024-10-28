import React, { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';

export function ContactForm({ onClose }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState('');
  const [isVisible, setIsVisible] = useState(false);

  // Add fade-in effect when component mounts
  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');

    try {
      await emailjs.send(
        'personal_gmail',
        'contact_fill',
        formData,
        'eBdL_IYvnHN6gAaC_'
      );
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setStatus('error');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

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
        onClick={e => e.stopPropagation()}
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

        <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem' }}>Contact Me</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#333',
                border: '1px solid #444',
                borderRadius: '4px',
                color: 'white'
              }}
            />
          </div>

          <div>
            <input
              type="email"
              name="email"
              placeholder="Your Email"
              value={formData.email}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#333',
                border: '1px solid #444',
                borderRadius: '4px',
                color: 'white'
              }}
            />
          </div>

          <div>
            <input
              type="text"
              name="subject"
              placeholder="Subject"
              value={formData.subject}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#333',
                border: '1px solid #444',
                borderRadius: '4px',
                color: 'white'
              }}
            />
          </div>

          <div>
            <textarea
              name="message"
              placeholder="Your Message"
              value={formData.message}
              onChange={handleChange}
              required
              style={{
                width: '100%',
                padding: '0.5rem',
                backgroundColor: '#333',
                border: '1px solid #444',
                borderRadius: '4px',
                color: 'white',
                minHeight: '150px',
                resize: 'vertical'
              }}
            />
          </div>

          <button 
            type="submit"
            disabled={status === 'sending'}
            style={{
              padding: '0.75rem',
              backgroundColor: '#007bff',
              border: 'none',
              borderRadius: '4px',
              color: 'white',
              cursor: status === 'sending' ? 'not-allowed' : 'pointer',
              opacity: status === 'sending' ? 0.7 : 1
            }}
          >
            {status === 'sending' ? 'Sending...' : 'Send Message'}
          </button>

          {status === 'success' && (
            <div style={{ color: '#28a745', textAlign: 'center', marginTop: '1rem' }}>
              Message sent successfully!
            </div>
          )}

          {status === 'error' && (
            <div style={{ color: '#dc3545', textAlign: 'center', marginTop: '1rem' }}>
              Failed to send message. Please try again.
            </div>
          )}
        </form>
      </div>
    </div>
  );
}

export default ContactForm;