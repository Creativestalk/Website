import React from 'react';
import { Phone, Mail, MapPin, Instagram } from 'lucide-react';
import ContactForm from '../components/ContactForm';

const ContactSection: React.FC = () => {
  return (
    <section id="contact" className="py-20 bg-dark">
      <div className="container mx-auto px-4 md:px-6 max-w-6xl">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary font-medium py-2 px-4 rounded-full mb-4 animate-fade-in">
            Contact Us
          </span>
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 animate-fade-in">
            Let's Talk
          </h2>
          <p className="text-gray-medium max-w-2xl mx-auto animate-fade-in animate-delay-100">
            Ready to bring your vision to life? Reach out to discuss your project.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-dark-card rounded-2xl p-8 shadow-xl border border-white/5">
          <div className="lg:order-2 animate-fade-in animate-delay-200">
            <ContactForm />
          </div>
          
          <div className="lg:order-1 animate-fade-in animate-delay-100">
            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-medium mb-4">Get in Touch</h3>
                <p className="text-gray-light mb-6">
                  Have a project in mind? Contact us today and let's create something amazing together.
                </p>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-dark/50 hover:bg-dark/70 transition-colors duration-300">
                  <Phone className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-gray-light font-medium">Phone</h4>
                    <p className="text-gray-medium">+91 9948880710</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-dark/50 hover:bg-dark/70 transition-colors duration-300">
                  <Mail className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-gray-light font-medium">Email</h4>
                    <p className="text-gray-medium">creativestalkstudio@gmail.com</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-dark/50 hover:bg-dark/70 transition-colors duration-300">
                  <a 
                    href="https://g.co/kgs/41NAo1h"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1"
                  >
                    <MapPin className="h-5 w-5 text-primary hover:text-primary/80 transition-colors duration-300" />
                  </a>
                  <div>
                    <h4 className="text-gray-light font-medium">Address</h4>
                    <a 
                      href="https://g.co/kgs/41NAo1h"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-medium hover:text-primary transition-colors duration-300"
                    >
                      H No: 5-4-1233, Plot No: 182, Sharada Nagar, Vanasthalipuram
                    </a>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4 p-4 rounded-lg bg-dark/50 hover:bg-dark/70 transition-colors duration-300">
                  <Instagram className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <h4 className="text-gray-light font-medium">Instagram</h4>
                    <p className="text-gray-medium">@creativestalkdesigns</p>
                  </div>
                </div>
              </div>
              
              <div className="pt-8 mt-8 border-t border-white/5">
                <h3 className="text-xl font-medium mb-6">Working Hours</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 rounded-lg bg-dark/50">
                    <span className="text-gray-light">Monday - Friday:</span>
                    <span className="text-gray-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-dark/50">
                    <span className="text-gray-light">Saturday:</span>
                    <span className="text-gray-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center p-3 rounded-lg bg-dark/50">
                    <span className="text-gray-light">Sunday:</span>
                    <span className="text-gray-medium">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;