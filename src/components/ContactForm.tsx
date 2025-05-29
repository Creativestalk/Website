import React, { useState, useRef } from 'react';
import { Send } from 'lucide-react';
import emailjs from '@emailjs/browser';

const ContactForm: React.FC = () => {
  const form = useRef<HTMLFormElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    
    try {
      if (form.current) {
        await emailjs.sendForm(
          'service_rurl5zk', // Replace with your EmailJS service ID
          'template_ohgyuti', // Replace with your EmailJS template ID
          form.current,
          'vmI0A90wXmGV8zowX' // Replace with your EmailJS public key
        );
        
        setSubmitted(true);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: ''
        });
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setSubmitted(false);
        }, 5000);
      }
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {submitted ? (
        <div className="bg-dark-card p-6 rounded-lg text-center animate-fade-in">
          <div className="text-primary text-5xl mb-4">✓</div>
          <h3 className="text-xl font-medium mb-2">Message Sent!</h3>
          <p className="text-gray-medium">We'll get back to you soon.</p>
        </div>
      ) : (
        <form ref={form} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-light mb-1">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="Your name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-light mb-1">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="your@email.com"
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-light mb-1">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="form-input"
              placeholder="Your phone number"
            />
          </div>
          
          <div>
            <label htmlFor="message" className="block text-sm font-medium text-gray-light mb-1">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              required
              value={formData.message}
              onChange={handleChange}
              className="form-input resize-none"
              placeholder="Tell us about your project..."
            ></textarea>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}
          
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary w-full flex items-center justify-center space-x-2"
          >
            {isSubmitting ? (
              <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <>
                <span>Send Message</span>
                <Send className="h-4 w-4" />
              </>
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default ContactForm;