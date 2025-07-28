import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './SafeIcon';

const { FiX, FiSend, FiLoader, FiUser, FiCoffee, FiChevronDown, FiChevronUp } = FiIcons;

const CustomerServiceChatbot = () => {
  // Randomly choose an assistant name on component mount
  const assistantNames = ['Peter', 'Jenny', 'Melissa'];
  const [assistantName] = useState(() => {
    const randomIndex = Math.floor(Math.random() * assistantNames.length);
    return assistantNames[randomIndex];
  });

  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversations, setConversations] = useState([]);
  const messagesEndRef = useRef(null);

  // Initialize conversation with greeting that includes the assistant's name
  useEffect(() => {
    setConversations([{
      role: 'bot',
      content: `Hello! ☕ I'm ${assistantName} from Cogli Caffe! I'm here to help you with any questions about our products, orders, returns, or refunds. How can I assist you today?`
    }]);
  }, [assistantName]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    if (isOpen && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [conversations, isOpen]);

  const quickActions = [
    { id: 'order-status', label: 'Check Order Status', icon: FiIcons.FiPackage },
    { id: 'returns', label: 'Returns & Refunds', icon: FiIcons.FiRotateCcw },
    { id: 'shipping', label: 'Shipping Info', icon: FiIcons.FiTruck },
    { id: 'products', label: 'Product Questions', icon: FiCoffee }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // Add user message
    setConversations(prev => [...prev, { role: 'user', content: message }]);
    setMessage('');
    setIsTyping(true);

    // Generate bot response based on user query
    setTimeout(() => {
      const userQuery = message.toLowerCase();
      let response = '';

      // Order status queries
      if (userQuery.includes('order') && (userQuery.includes('status') || userQuery.includes('track'))) {
        response = "I can help you track your order! 📦 You can check your order status by:\n\n1. Going to 'My Account' > 'Orders' if you're logged in\n2. Using our Order Tracking page with your order number\n3. Checking the email confirmation we sent you\n\nDo you have your order number handy?";
      }
      // Returns and refunds
      else if (userQuery.includes('return') || userQuery.includes('refund') || userQuery.includes('exchange')) {
        response = "I'd be happy to help with returns and refunds! ↩️\n\n**Our Return Policy:**\n• 30-day return window from delivery\n• Items must be unopened and in original packaging\n• Coffee beans: unopened packages only\n• Merchandise: original condition with tags\n\n**How to Return:**\n1. Contact us with your order number\n2. We'll email you a prepaid return label\n3. Package items securely\n4. Drop off at any shipping location\n\n**Refund Timeline:** 5-7 business days after we receive your return\n\nWould you like me to start a return request for you?";
      }
      // Shipping information
      else if (userQuery.includes('ship') || userQuery.includes('deliver') || userQuery.includes('when will')) {
        response = "Great question about shipping! 🚚\n\n**Free Shipping:** All orders qualify for free shipping!\n\n**Delivery Times:**\n• Standard: 3-5 business days\n• Express: 1-2 business days (available at checkout)\n\n**Processing Time:** 1-2 business days before shipping\n\n**Tracking:** You'll receive a tracking number via email once your order ships.\n\nIs there a specific order you'd like to know about?";
      }
      // Product questions
      else if (userQuery.includes('coffee') || userQuery.includes('product') || userQuery.includes('roast') || userQuery.includes('blend')) {
        response = "I love talking about our coffee! ☕\n\n**Our Coffee:**\n• Premium beans sourced from 15+ countries\n• Roasted fresh in small batches\n• Available in whole bean or ground\n• Light, medium, and dark roasts available\n\n**Popular Blends:**\n• House Blend - smooth and balanced\n• Dark Roast - bold and rich\n• Single Origin - unique regional flavors\n\n**Need Recommendations?** Tell me:\n• Do you prefer light, medium, or dark roast?\n• Any flavor preferences (fruity, nutty, chocolatey)?\n• How do you usually brew your coffee?";
      }
      // Payment issues
      else if (userQuery.includes('payment') || userQuery.includes('charge') || userQuery.includes('card') || userQuery.includes('billing')) {
        response = "I can help with payment concerns! 💳\n\n**Common Issues:**\n• Payment declined: Check card details and billing address\n• Duplicate charges: Usually a temporary hold, will resolve in 2-3 days\n• Wrong amount: Please provide your order number for review\n\n**We Accept:**\n• All major credit cards\n• PayPal\n• Apple Pay & Google Pay\n\n**Security:** All payments are processed securely through Stripe\n\nWhat specific payment issue can I help you with?";
      }
      // Account issues
      else if (userQuery.includes('account') || userQuery.includes('login') || userQuery.includes('password')) {
        response = "Let me help with your account! 👤\n\n**Common Solutions:**\n• **Forgot Password:** Use 'Forgot Password' link on login page\n• **Can't Login:** Check email spelling and caps lock\n• **Account Locked:** Try password reset or contact us\n• **Update Info:** Go to 'My Account' > 'Profile'\n\n**Account Benefits:**\n• Order tracking and history\n• Faster checkout\n• Exclusive offers\n• Wishlist functionality\n\nWhat account issue are you experiencing?";
      }
      // Wholesale/bulk orders
      else if (userQuery.includes('wholesale') || userQuery.includes('bulk') || userQuery.includes('business')) {
        response = "Interested in wholesale or bulk orders? ☕📦\n\n**Wholesale Program:**\n• Minimum order quantities apply\n• Volume discounts available\n• Dedicated account manager\n• Custom packaging options\n\n**Perfect for:**\n• Restaurants & cafes\n• Offices\n• Events & catering\n• Retail stores\n\n**Next Steps:**\n1. Contact our wholesale team\n2. Discuss your needs and volume\n3. Receive custom pricing\n4. Set up regular deliveries\n\nWould you like me to connect you with our wholesale team?";
      }
      // Gift cards
      else if (userQuery.includes('gift') && userQuery.includes('card')) {
        response = "Gift cards are perfect for coffee lovers! 🎁\n\n**Available Amounts:**\n• $25, $50, $100, or custom amount\n• Digital delivery via email\n• No expiration date\n• Can be used for any products\n\n**How It Works:**\n1. Purchase online\n2. Recipient gets email with code\n3. Use code at checkout\n4. Any remaining balance stays on card\n\n**Perfect For:**\n• Birthdays & holidays\n• Corporate gifts\n• Coffee enthusiast friends\n• Last-minute gifts\n\nWould you like to purchase a gift card?";
      }
      // Assistant name question
      else if (userQuery.includes('your name') || userQuery.includes('who are you')) {
        response = `My name is ${assistantName}! I'm a customer service assistant at Cogli Caffe. I'm here to help with any questions about our products, orders, returns, or anything else you need assistance with! How can I help you today?`;
      }
      // Default response
      else {
        response = `I'd be happy to help! 😊 I'm ${assistantName}, your Cogli Caffe assistant. Here are some common topics I can assist with:\n\n• **Order Status & Tracking**\n• **Returns & Refunds**\n• **Shipping Information**\n• **Product Questions**\n• **Payment Issues**\n• **Account Help**\n• **Wholesale Inquiries**\n• **Gift Cards**\n\nCould you tell me more about what you need help with? Or feel free to ask me anything about Cogli Caffe!`;
      }

      setConversations(prev => [...prev, { role: 'bot', content: response }]);
      setIsTyping(false);
    }, 1500);
  };

  const handleQuickAction = (actionId) => {
    let quickMessage = '';
    switch (actionId) {
      case 'order-status':
        quickMessage = 'I need help checking my order status';
        break;
      case 'returns':
        quickMessage = 'I want to return or exchange an item';
        break;
      case 'shipping':
        quickMessage = 'I have questions about shipping and delivery';
        break;
      case 'products':
        quickMessage = 'I have questions about your coffee products';
        break;
      default:
        return;
    }
    
    setMessage(quickMessage);
    handleSubmit({ preventDefault: () => {} });
  };

  // Coffee cup icon component
  const CoffeeCupIcon = ({ className }) => (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path d="M2 21h18v-2H2v2zM20 8h-2V5c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.1 0 2-.9 2-2v-2c0-1.1-.9-2-2-2zm-4 7c0 1.1-.9 2-2 2H6c-1.1 0-2-.9-2-2V5h12v10zm4-5h-2V8h2v2z"/>
    </svg>
  );

  return (
    <>
      {/* Chat button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 bg-coffee-600 text-white w-16 h-16 rounded-full shadow-xl flex items-center justify-center z-40 hover:bg-coffee-700 transition-colors"
      >
        <CoffeeCupIcon className="w-8 h-8" />
        
        {/* Notification dot for new users */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: [0, 1.2, 1] }}
          transition={{ delay: 2, duration: 0.5 }}
          className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
        >
          <span className="text-xs text-white font-bold">!</span>
        </motion.div>
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-200"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-coffee-700 to-coffee-600 text-white p-4 flex justify-between items-center">
              <div className="flex items-center">
                <CoffeeCupIcon className="w-6 h-6 mr-3" />
                <div>
                  <h3 className="font-semibold">
                    {assistantName} from Cogli Caffe
                  </h3>
                  <p className="text-xs text-cream-200">Always here to help ☕</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:text-cream-200 transition-colors"
              >
                <SafeIcon icon={FiX} className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            {conversations.length <= 1 && (
              <div className="p-4 bg-cream-50 border-b border-gray-200">
                <p className="text-sm text-coffee-700 mb-3 font-medium">Quick Help:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => (
                    <button
                      key={action.id}
                      onClick={() => handleQuickAction(action.id)}
                      className="flex items-center p-2 bg-white rounded-lg border border-coffee-200 hover:border-coffee-400 hover:bg-coffee-50 transition-colors text-xs"
                    >
                      <SafeIcon icon={action.icon} className="w-4 h-4 mr-2 text-coffee-600" />
                      <span className="text-coffee-700">{action.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-cream-50 to-white">
              {conversations.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-4 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-lg ${
                      msg.role === 'user'
                        ? 'bg-coffee-600 text-white rounded-br-none'
                        : 'bg-white shadow-sm border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <div className="flex items-center mb-1">
                      {msg.role === 'bot' ? (
                        <CoffeeCupIcon className="w-4 h-4 mr-2 text-coffee-600" />
                      ) : (
                        <SafeIcon icon={FiUser} className="w-4 h-4 mr-2" />
                      )}
                      <span className="text-xs font-medium">
                        {msg.role === 'bot' ? assistantName : 'You'}
                      </span>
                    </div>
                    <div
                      className={`text-sm whitespace-pre-line ${
                        msg.role === 'user' ? 'text-white' : 'text-gray-800'
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                </div>
              ))}

              {/* Typing indicator */}
              {isTyping && (
                <div className="flex justify-start mb-4">
                  <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-200 rounded-bl-none">
                    <div className="flex items-center mb-1">
                      <CoffeeCupIcon className="w-4 h-4 mr-2 text-coffee-600" />
                      <span className="text-xs font-medium">{assistantName}</span>
                    </div>
                    <div className="flex items-center">
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
            <form onSubmit={handleSubmit} className="border-t border-gray-200 p-4 bg-white">
              <div className="flex items-center">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 py-2 px-3 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                  disabled={isTyping}
                />
                <button
                  type="submit"
                  disabled={!message.trim() || isTyping}
                  className="bg-coffee-600 text-white py-2 px-4 rounded-r-lg disabled:bg-coffee-400 hover:bg-coffee-700 transition-colors"
                >
                  {isTyping ? (
                    <SafeIcon icon={FiLoader} className="w-5 h-5 animate-spin" />
                  ) : (
                    <SafeIcon icon={FiSend} className="w-5 h-5" />
                  )}
                </button>
              </div>
              
              <div className="text-xs text-gray-500 mt-2 text-center">
                Need immediate help? Email us at{' '}
                <a href="mailto:support@coglicaffe.com" className="text-coffee-600 hover:underline">
                  support@coglicaffe.com
                </a>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Help tooltip for first-time visitors */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: 3 }}
            className="fixed bottom-24 right-6 bg-coffee-800 text-white px-4 py-2 rounded-lg shadow-lg max-w-xs z-40"
          >
            <div className="text-sm">
              <p className="font-semibold mb-1">Need Help? ☕</p>
              <p>I'm {assistantName}, here to assist with orders, returns, and product questions!</p>
            </div>
            <div className="absolute -bottom-2 right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-coffee-800"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CustomerServiceChatbot;