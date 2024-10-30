// ContactForm.js
export function showContactForm() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'contact-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';

  // Create form container
  const formContainer = document.createElement('div');
  formContainer.className = 'contact-form-container';
  formContainer.style.backgroundColor = '#1a1a1a';
  formContainer.style.padding = '2rem';
  formContainer.style.borderRadius = '8px';
  formContainer.style.maxWidth = '500px';
  formContainer.style.width = '90%';
  formContainer.style.color = 'white';
  formContainer.style.position = 'relative';

  // Stop click propagation
  formContainer.addEventListener('click', (e) => e.stopPropagation());
  overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeContactForm();
  });

  // Create close button
  const closeButton = document.createElement('button');
  closeButton.textContent = '×';
  closeButton.style.position = 'absolute';
  closeButton.style.top = '1rem';
  closeButton.style.right = '1rem';
  closeButton.style.background = 'none';
  closeButton.style.border = 'none';
  closeButton.style.color = 'white';
  closeButton.style.fontSize = '1.5rem';
  closeButton.style.cursor = 'pointer';
  closeButton.onclick = closeContactForm;

  // Create form
  const form = document.createElement('form');
  form.style.display = 'flex';
  form.style.flexDirection = 'column';
  form.style.gap = '1rem';

  // Form fields
  const fields = [
      { name: 'name', type: 'text', placeholder: 'Your Name' },
      { name: 'email', type: 'email', placeholder: 'Your Email' },
      { name: 'subject', type: 'text', placeholder: 'Subject' },
      { name: 'message', type: 'textarea', placeholder: 'Your Message' }
  ];

  fields.forEach(field => {
      const input = field.type === 'textarea' 
          ? document.createElement('textarea')
          : document.createElement('input');
          
      if (field.type === 'textarea') {
          input.style.minHeight = '150px';
          input.style.resize = 'vertical';
      } else {
          input.type = field.type;
      }

      input.name = field.name;
      input.placeholder = field.placeholder;
      input.style.width = '100%';
      input.style.padding = '0.5rem';
      input.style.backgroundColor = '#333';
      input.style.border = '1px solid #444';
      input.style.borderRadius = '4px';
      input.style.color = 'white';
      input.required = true;

      form.appendChild(input);
  });

  // Create submit button
  const submitButton = document.createElement('button');
  submitButton.type = 'submit';
  submitButton.textContent = 'Send Message';
  submitButton.style.padding = '0.75rem';
  submitButton.style.backgroundColor = '#007bff';
  submitButton.style.border = 'none';
  submitButton.style.borderRadius = '4px';
  submitButton.style.color = 'white';
  submitButton.style.cursor = 'pointer';

  // Create status message
  const statusMessage = document.createElement('div');
  statusMessage.style.color = '#28a745';
  statusMessage.style.textAlign = 'center';
  statusMessage.style.marginTop = '1rem';

  // Form submit handler
  form.onsubmit = async (e) => {
      e.preventDefault();
      statusMessage.textContent = 'Sending...';
      
      try {
          // Replace these with your actual EmailJS service ID and template ID
          const result = await emailjs.sendForm(
              'personal_gmail', 
              'contact_fill',
              form
          );
          
          statusMessage.style.color = '#28a745';
          statusMessage.textContent = 'Message sent successfully!';
          setTimeout(closeContactForm, 2000);
      } catch (error) {
          console.error('Failed to send email:', error);
          statusMessage.style.color = '#dc3545';
          statusMessage.textContent = 'Failed to send message. Please try again.';
      }
  };

  // Append elements
  form.appendChild(submitButton);
  form.appendChild(statusMessage);
  formContainer.appendChild(closeButton);
  formContainer.appendChild(form);
  overlay.appendChild(formContainer);
  document.body.appendChild(overlay);
}

function closeContactForm() {
  const overlay = document.querySelector('.contact-overlay');
  if (overlay) {
      overlay.remove();
  }
}
