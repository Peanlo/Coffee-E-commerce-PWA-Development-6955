import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet-async';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../components/common/SafeIcon';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import toast from 'react-hot-toast';

const { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiUser, FiMessageSquare } = FiIcons;

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate form submission
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      toast.success('Message sent successfully! We\'ll get back to you soon.');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: FiMail,
      title: 'Email',
      content: 'hello@coglicaffe.com',
      link: 'mailto:hello@coglicaffe.com'
    },
    {
      icon: FiPhone,
      title: 'Phone',
      content: '(877) 360-0088',
      link: 'tel:8773600088'
    },
    {
      icon: FiMapPin,
      title: 'Address',
      content: '4736 Royal Ave, #17170\nEugene, OR 97402\nUnited States',
      link: null
    },
    {
      icon: FiClock,
      title: 'Business Hours',
      content: 'Monday - Friday: 9:00 AM - 6:00 PM PST\nWeekends: 10:00 AM - 4:00 PM PST',
      link: null
    }
  ];

  return (
    <>
      <Helmet>
        <title>Contact Us - Cogli Caffe</title>
        <meta name="description" content="Get in touch with Cogli Caffe. We're here to help with any questions about our premium coffee and merchandise." />
      </Helmet>

      <Header />

      <main className="min-h-screen bg-cream-50">
        {/* Hero Section */}
        <section className="bg-coffee-800 text-white py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Us</h1>
              <p className="text-xl text-cream-200 max-w-2xl mx-auto">
                We'd love to hear from you. Send us a message and we'll respond as soon as possible.
              </p>
            </motion.div>
          </div>
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-xl shadow-lg p-8"
            >
              <h2 className="text-2xl font-bold text-coffee-800 mb-6">Send us a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-coffee-700 mb-1">
                      Name *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiUser} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400" />
                      <input
                        id="name"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                        placeholder="Your name"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-coffee-700 mb-1">
                      Email *
                    </label>
                    <div className="relative">
                      <SafeIcon icon={FiMail} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400" />
                      <input
                        id="email"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                        placeholder="your.email@example.com"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-coffee-700 mb-1">
                    Subject *
                  </label>
                  <input
                    id="subject"
                    name="subject"
                    type="text"
                    required
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full py-3 px-4 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                    placeholder="What's this about?"
                  />
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-coffee-700 mb-1">
                    Message *
                  </label>
                  <div className="relative">
                    <SafeIcon icon={FiMessageSquare} className="absolute left-3 top-3 text-coffee-400" />
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent resize-none"
                      placeholder="Tell us how we can help you..."
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full btn-coffee py-3 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <SafeIcon icon={FiSend} className="w-5 h-5" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl font-bold text-coffee-800 mb-6">Get in Touch</h2>
                <p className="text-coffee-600 leading-relaxed">
                  Whether you have questions about our products, need help with an order, 
                  or just want to share your coffee experience with us, we're here to help. 
                  Our team is passionate about providing exceptional customer service.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <motion.div
                    key={info.title}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-xl shadow-lg p-6"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="bg-coffee-100 p-3 rounded-lg">
                        <SafeIcon icon={info.icon} className="w-6 h-6 text-coffee-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-coffee-800 mb-2">{info.title}</h3>
                        {info.link ? (
                          <a
                            href={info.link}
                            className="text-coffee-600 hover:text-coffee-800 transition-colors"
                          >
                            {info.content}
                          </a>
                        ) : (
                          <p className="text-coffee-600 whitespace-pre-line">{info.content}</p>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* FAQ Section */}
              <div className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-xl font-semibold text-coffee-800 mb-4">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-coffee-700">How long does shipping take?</h4>
                    <p className="text-sm text-coffee-600 mt-1">
                      We offer free shipping on all orders. Standard delivery takes 3-5 business days.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-coffee-700">What's your return policy?</h4>
                    <p className="text-sm text-coffee-600 mt-1">
                      We offer a 30-day money-back guarantee on all products. Contact us for returns.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-coffee-700">Do you offer wholesale pricing?</h4>
                    <p className="text-sm text-coffee-600 mt-1">
                      Yes! Contact us directly to discuss bulk orders and wholesale pricing.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ContactPage;