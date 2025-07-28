import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const { FiMessageSquare, FiX, FiSend, FiLoader, FiUser, FiCpu, FiChevronDown, FiChevronUp } = FiIcons;

const AIAdminAssistant = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm your Admin Assistant. How can I help you with the admin panel today?"
    }
  ]);
  
  const messagesEndRef = useRef(null);
  
  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    
    // Add user message
    setConversations(prev => [...prev, { role: 'user', content: message }]);
    setMessage('');
    setIsTyping(true);
    
    // Generate AI response based on user query
    setTimeout(() => {
      const userQuery = message.toLowerCase();
      let response = '';
      
      // Simple pattern matching for common queries
      if (userQuery.includes('add product') || userQuery.includes('create product')) {
        response = "To add a new product, go to Products > Add New Product. Fill in the required fields including name, price, description, and upload at least one image. Don't forget to set the inventory status before saving.";
      } else if (userQuery.includes('order') && userQuery.includes('status')) {
        response = "You can update order statuses from the Orders section. Click on an order to view its details, then use the status dropdown to change it. For Printify orders, you can also sync the status directly from Printify using the refresh button.";
      } else if (userQuery.includes('printify')) {
        response = "For Printify integration, make sure your API key and Shop ID are configured in Settings > Printify. You can import products using the Sync Products button on the dashboard or Products section. Orders with Printify items will automatically be sent to Printify for fulfillment.";
      } else if (userQuery.includes('user') && (userQuery.includes('add') || userQuery.includes('create'))) {
        response = "To add a new admin user, go to Users > Admin Users and click 'Add New Admin'. Fill in their details and select the appropriate role. Be careful when assigning Super Admin privileges.";
      } else if (userQuery.includes('payment') || userQuery.includes('stripe') || userQuery.includes('paypal')) {
        response = "Payment settings can be configured in Settings > Payment Methods. You'll need to enter your Stripe and/or PayPal API credentials. Make sure to test the payment flow after making any changes.";
      } else if (userQuery.includes('help') || userQuery.includes('manual')) {
        response = "You can access the full admin user manual by clicking on Help & Manual in the sidebar. It contains comprehensive documentation for all admin features.";
      } else {
        response = "I'm not sure I understand your question. Try checking the Help & Manual section for comprehensive documentation, or try rephrasing your question with more specific details.";
      }
      
      setConversations(prev => [...prev, { role: 'assistant', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <>
      {/* Chat button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-coffee-600 text-white w-14 h-14 rounded-full shadow-lg flex items-center justify-center"
      >
        <SafeIcon icon={FiMessageSquare} className="w-6 h-6" />
      </motion.button>
      
      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[500px] bg-white rounded-lg shadow-xl flex flex-col overflow-hidden z-50"
          >
            {/* Header */}
            <div className="bg-coffee-700 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <SafeIcon icon={FiCpu} className="w-5 h-5 mr-2" />
                <h3 className="font-medium">Admin Assistant</h3>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-white hover:text-cream-200">
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-cream-50">
              {conversations.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-coffee-600 text-white rounded-br-none'
                        : 'bg-white shadow-sm border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {msg.role === 'assistant' ? (
                        <SafeIcon icon={FiCpu} className="w-4 h-4 mr-1 text-coffee-600" />
                      ) : (
                        <SafeIcon icon={FiUser} className="w-4 h-4 mr-1" />
                      )}
                      <span className="text-xs font-medium">
                        {msg.role === 'assistant' ? 'Admin Assistant' : 'You'}
                      </span>
                    </div>
                    <p className={`text-sm ${msg.role === 'user' ? 'text-white' : 'text-gray-800'}`}>
                      {msg.content}
                    </p>
                  </div>
                </div>
              ))}
              
              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 rounded-bl-none">
                    <div className="flex items-center">
                      <SafeIcon icon={FiCpu} className="w-4 h-4 mr-1 text-coffee-600" />
                      <span className="text-xs font-medium">Admin Assistant</span>
                    </div>
                    <div className="flex items-center mt-1">
                      <div className="w-2 h-2 bg-coffee-400 rounded-full animate-pulse mr-1"></div>
                      <div className="w-2 h-2 bg-coffee-400 rounded-full animate-pulse delay-150 mr-1"></div>
                      <div className="w-2 h-2 bg-coffee-400 rounded-full animate-pulse delay-300"></div>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input */}
            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-3 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about admin features..."
                  className="flex-1 py-2 px-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isTyping}
                  className="bg-coffee-600 text-white py-2 px-4 rounded-r-lg disabled:bg-coffee-400"
                >
                  {isTyping ? (
                    <SafeIcon icon={FiLoader} className="w-5 h-5 animate-spin" />
                  ) : (
                    <SafeIcon icon={FiSend} className="w-5 h-5" />
                  )}
                </button>
              </div>
              <div className="text-xs text-gray-500 mt-2 flex items-center">
                <span>Examples:</span>
                <button 
                  type="button" 
                  onClick={() => setMessage("How do I add a new product?")}
                  className="ml-2 text-coffee-600 hover:underline"
                >
                  Add product
                </button>
                <button 
                  type="button" 
                  onClick={() => setMessage("How do I update order status?")}
                  className="ml-2 text-coffee-600 hover:underline"
                >
                  Update order
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* AI Admin Assistant Help Drawer */}
      <div className="fixed bottom-6 left-6 z-50">
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="bg-white rounded-lg shadow-lg max-w-xs"
            >
              <div className="bg-coffee-700 text-white p-3 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center">
                  <SafeIcon icon={FiCpu} className="w-4 h-4 mr-2" />
                  <h3 className="text-sm font-medium">Admin Tips</h3>
                </div>
                <button onClick={() => setIsOpen(true)} className="text-white hover:text-cream-200 text-sm">
                  Open Assistant
                </button>
              </div>
              <div className="p-3 text-sm">
                <p className="text-gray-700 mb-2">
                  Need help with the admin panel? Click the chat icon to ask questions!
                </p>
                <div className="text-coffee-600 font-medium cursor-pointer" onClick={() => setIsOpen(true)}>
                  Ask now →
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default AIAdminAssistant;