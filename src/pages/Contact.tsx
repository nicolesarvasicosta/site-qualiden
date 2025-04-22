import React, { useState, useEffect } from 'react';
import { Mail, Phone, Send, CheckCircle, AlertCircle, Loader2, X, ChevronDown } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import emailjs from '@emailjs/browser';
import { contentfulClient, ContentfulCategory } from '../lib/contentful';

// Add this function near the top of your component
function isValidEmail(email: string) {
  // Simple RFC 5322 compliant regex for email validation
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const Contact = () => {
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get('category');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    categories: preselectedCategory ? [preselectedCategory] : [] as string[]
  });

  const [categories, setCategories] = useState<Set<string>>(new Set());
  const [showCopyNotification, setShowCopyNotification] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [loading, setLoading] = useState(true);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [lastSubmitTime, setLastSubmitTime] = useState<number>(0);

  const rawPhoneNumber = '+5511981001712'; // Correct format for WhatsApp
  const whatsappUrl = `https://wa.me/${rawPhoneNumber}`;
  const formattedPhoneNumber = '+55 (11) 98100-1712'; // Display format
  const emailAddress = 'export@qualiden.com.br';

  // Safely access environment variables
  const emailJsServiceId = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
  const emailJsTemplateId = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
  const emailJsPublicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await contentfulClient.getEntries<ContentfulCategory>({
          content_type: 'newsite',
        });

        const uniqueSubcategories = new Set<string>();
        response.items.forEach(item => {
          if (item.fields.subcategory) {
            uniqueSubcategories.add(item.fields.subcategory);
          }
        });

        setCategories(uniqueSubcategories);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching categories:', error);
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const generateMessageTemplate = () => {
      if (formData.categories.length === 0) {
        return "I am interested in learning more about your products and services. Could you please provide me with detailed information about your offerings?";
      }

      const categoriesList = formData.categories.join(', ');
      return `I am interested in the following categories: ${categoriesList}.\n\nPlease provide details on:\n- Product specifications and pricing\n- Available quantities and minimum orders\n- Delivery terms and timeframes\n- Payment conditions\n\nLooking forward to your response.`;
    };

    setFormData(prev => ({
      ...prev,
      message: generateMessageTemplate(),
      subject: formData.categories.length > 0 
        ? `Inquiry about ${formData.categories.join(', ')}`
        : 'Product Information Request'
    }));
  }, [formData.categories]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const dropdown = document.getElementById('category-dropdown');
      if (dropdown && !dropdown.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Email validation
    if (!isValidEmail(formData.email)) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }

    // Rate limiting: 30 seconds between submissions
    const now = Date.now();
    if (now - lastSubmitTime < 30000) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }
    setLastSubmitTime(now);

    setSubmitStatus('sending');

    try {
      if (!emailJsServiceId || !emailJsTemplateId || !emailJsPublicKey) {
        throw new Error('EmailJS environment variables are not set.');
      }

      await emailjs.send(
        emailJsServiceId,
        emailJsTemplateId,
        {
          to_email: emailAddress,
          from_name: formData.name,
          from_email: formData.email,
          subject: formData.subject,
          categories: formData.categories.join(', '),
          message: formData.message,
        },
        emailJsPublicKey
      );

      setSubmitStatus('success');
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        categories: []
      });

      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    } catch (error) {
      console.error('Failed to send email:', error);
      setSubmitStatus('error');
      
      setTimeout(() => {
        setSubmitStatus('idle');
      }, 5000);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCategoryToggle = (category: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(category)
        ? prev.categories.filter(c => c !== category)
        : [...prev.categories, category]
    }));
  };

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(emailAddress);
    setShowCopyNotification(true);
    setTimeout(() => setShowCopyNotification(false), 2000);
  };

  const removeCategory = (categoryToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.filter(category => category !== categoryToRemove)
    }));
  };

  return (
    <div className="min-h-screen">
      <div className="relative h-[600px] bg-gradient-to-br from-blue-900 via-blue-600 to-blue-400 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.1),transparent_50%)]" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center pt-40 z-10">
          <h1 className="text-6xl font-playfair font-bold text-white mb-6 text-center">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-100 max-w-2xl mx-auto">
            Have questions about our products? We're here to help you connect with global markets.
          </p>
        </div>
        {/* Organic SVG shape at the bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full h-[120px] z-0"
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          preserveAspectRatio="none"
        >
          <path
            d="M0,100 C400,40 1040,180 1440,60 L1440,120 L0,120 Z"
            fill="#fff"
            fillOpacity="1"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Contact Information Cards */}
          <div className="space-y-6">
            {/* Phone Card */}
            <div className="relative group">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="block bg-white rounded-2xl p-6 shadow-[0_25px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_35px_60px_rgba(0,0,0,0.45)] transform hover:-translate-y-1 transition-all duration-300"
              >
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-3">
                    <Phone className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">Phone</h3>
                    <p className="text-gray-600">Available at All Times</p>
                    <p className="text-blue-600 font-medium mt-2">{formattedPhoneNumber}</p>
                  </div>
                </div>
              </a>

              {/* Tooltip */}
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm flex items-center shadow-lg">
                  <Send className="h-4 w-4 mr-2" />
                  Click to send a message
                </div>
              </div>
            </div>

            {/* Email Card */}
            <button
              onClick={handleCopyEmail}
              className="w-full bg-white rounded-2xl p-6 shadow-[0_25px_50px_rgba(0,0,0,0.35)] hover:shadow-[0_35px_60px_rgba(0,0,0,0.45)] transform hover:-translate-y-1 transition-all duration-300 text-left relative"
            >
              <div className="flex items-start">
                <div className="bg-blue-100 rounded-full p-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-1">Email</h3>
                  <p className="text-gray-600">We'll respond within 48 hours</p>
                  <p className="text-blue-600 font-medium mt-2">{emailAddress}</p>
                </div>
              </div>
              {showCopyNotification && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full mt--2">
                  <div className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Email copied!
                  </div>
                </div>
              )}
            </button>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-[0_25px_50px_rgba(0,0,0,0.35)] p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 transform translate-x-16 -translate-y-16 bg-blue-600 opacity-10 rounded-full"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 transform -translate-x-16 translate-y-16 bg-blue-400 opacity-10 rounded-full"></div>
            
            <div className="relative">
              <h2 className="text-2xl font-playfair font-semibold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Let's Start a Conversation</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Ready to explore global trade opportunities? Share your interests with us, and our expert team will craft a tailored solution for your business needs.
              </p>
              
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="relative group">
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="peer w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 placeholder-transparent focus:border-blue-500 focus:outline-none focus:bg-white transition-all duration-300"
                    placeholder="Name"
                    required
                  />
                  <label 
                    htmlFor="name"
                    className="absolute left-2 -top-2.5 bg-white px-2 text-sm text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Name
                  </label>
                </div>

                <div className="relative group">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="peer w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 placeholder-transparent focus:border-blue-500 focus:outline-none focus:bg-white transition-all duration-300"
                    placeholder="Email"
                    required
                  />
                  <label 
                    htmlFor="email"
                    className="absolute left-2 -top-2.5 bg-white px-2 text-sm text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Email
                  </label>
                  {submitStatus === 'error' && !isValidEmail(formData.email) && (
                    <div className="mt-2 text-red-600 text-sm">Please enter a valid email address.</div>
                  )}
                </div>

                {/* Multi-select Category Dropdown */}
                <div className="relative group" id="category-dropdown">
                  <div 
                    className="min-h-[48px] w-full px-4 py-2 rounded-lg bg-gray-50 border-2 border-gray-200 focus-within:border-blue-500 focus-within:bg-white transition-all duration-300 cursor-pointer"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  >
                    <label className="absolute left-2 -top-2.5 bg-white px-2 text-sm text-gray-600">
                      Product Categories
                    </label>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {formData.categories.length > 0 ? (
                        formData.categories.map((category) => (
                          <span
                            key={category}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800"
                          >
                            {category}
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                removeCategory(category);
                              }}
                              className="ml-2 hover:text-blue-600"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </span>
                        ))
                      ) : (
                        <span className="text-gray-500">Select categories...</span>
                      )}
                    </div>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                      <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-200 ${isDropdownOpen ? 'transform rotate-180' : ''}`} />
                    </div>
                  </div>

                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute z-10 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-60 overflow-auto">
                      {Array.from(categories).sort().map((category) => (
                        <div
                          key={category}
                          className={`
                            px-4 py-2 cursor-pointer transition-colors duration-150
                            ${formData.categories.includes(category) 
                              ? 'bg-blue-50 text-blue-800' 
                              : 'hover:bg-gray-50'
                            }
                          `}
                          onClick={() => handleCategoryToggle(category)}
                        >
                          <div className="flex items-center">
                            <div className={`
                              w-4 h-4 border-2 rounded mr-3 flex items-center justify-center
                              ${formData.categories.includes(category)
                                ? 'border-blue-500 bg-blue-500'
                                : 'border-gray-300'
                              }
                            `}>
                              {formData.categories.includes(category) && (
                                <CheckCircle className="h-3 w-3 text-white" />
                              )}
                            </div>
                            {category}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="relative group">
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="peer w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 placeholder-transparent focus:border-blue-500 focus:outline-none focus:bg-white transition-all duration-300"
                    placeholder="Subject"
                    required
                  />
                  <label 
                    htmlFor="subject"
                    className="absolute left-2 -top-2.5 bg-white px-2 text-sm text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Subject
                  </label>
                </div>

                <div className="relative group">
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={8}
                    className="peer w-full px-4 py-3 rounded-lg bg-gray-50 border-2 border-gray-200 placeholder-transparent focus:border-blue-500 focus:outline-none focus:bg-white transition-all duration-300 resize-none"
                    placeholder="Message"
                    required
                  ></textarea>
                  <label 
                    htmlFor="message"
                    className="absolute left-2 -top-2.5 bg-white px-2 text-sm text-gray-600 transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-placeholder-shown:left-4 peer-focus:-top-2.5 peer-focus:left-2 peer-focus:text-sm peer-focus:text-blue-600"
                  >
                    Message
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={submitStatus === 'sending'}
                  className={`
                    w-full py-3 px-6 rounded-lg flex items-center justify-center space-x-2
                    ${submitStatus === 'sending' 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 transform hover:scale-[1.02]'
                    }
                    text-white font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                  `}
                >
                  {submitStatus === 'sending' ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-5 w-5" />
                      <span>Send Message</span>
                    </>
                  )}
                </button>
              </form>

              {/* Status Messages */}
              {submitStatus === 'success' && (
                <div className="mt-4 flex items-center p-4 bg-green-50 rounded-lg text-green-700">
                  <CheckCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>Message sent successfully! We'll get back to you soon.</p>
                </div>
              )}
              {submitStatus === 'error' && (
                <div className="mt-4 flex items-center p-4 bg-red-50 rounded-lg text-red-700">
                  <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
                  <p>Failed to send message. Please try again later.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;