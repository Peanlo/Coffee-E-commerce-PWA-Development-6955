import React,{useState,useEffect} from 'react';
import {Link,useLocation,useNavigate} from 'react-router-dom';
import {motion,AnimatePresence} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import PromotionalBanner from '../common/PromotionalBanner';
import {useAuth} from '../../contexts/AuthContext';
import {useCart} from '../../contexts/CartContext';
import {useWishlist} from '../../contexts/WishlistContext';
import MobileMenu from './MobileMenu';
import CartSidebar from '../cart/CartSidebar';

const {FiShoppingCart,FiHeart,FiUser,FiMenu,FiSearch,FiLogOut}=FiIcons;

const Header=()=> {
  const [isMobileMenuOpen,setIsMobileMenuOpen]=useState(false);
  const [isUserMenuOpen,setIsUserMenuOpen]=useState(false);
  const [searchQuery,setSearchQuery]=useState('');
  const [logoLoaded,setLogoLoaded]=useState(false);
  const [logoError,setLogoError]=useState(false);
  const location=useLocation();
  const navigate=useNavigate();
  const {user,logout}=useAuth();
  const {getCartItemsCount,toggleCart}=useCart();
  const {wishlistItems}=useWishlist();

  const cartItemsCount=getCartItemsCount();
  const wishlistCount=wishlistItems.length;

  // Updated Logo URL
  const logoUrl='https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753101906746-Cogli%20Caffe%20Side%20By%20Side.png';

  const handleSearch=(e)=> {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  const handleLogout=()=> {
    logout();
    setIsUserMenuOpen(false);
    navigate('/');
  };

  const navLinks=[
    {to: '/',label: 'Home'},
    {to: '/products',label: 'Products'},
    {to: '/contact',label: 'Contact'}
  ];

  useEffect(()=> {
    const handleClickOutside=(event)=> {
      if (isUserMenuOpen && !event.target.closest('.user-menu')) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener('mousedown',handleClickOutside);
    return ()=> document.removeEventListener('mousedown',handleClickOutside);
  },[isUserMenuOpen]);

  return (
    <>
      {/* Promotional Banner */}
      <PromotionalBanner />

      <motion.header
        initial={{y: -100}}
        animate={{y: 0}}
        className="bg-white shadow-lg sticky top-0 z-40"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div
                whileHover={{scale: 1.05}}
                className="relative h-12 w-auto overflow-hidden"
              >
                {!logoError ? (
                  <img
                    src={logoUrl}
                    alt="Cogli Caffe Logo"
                    className={`h-full w-auto object-contain transition-opacity duration-300 ${
                      logoLoaded ? 'opacity-100' : 'opacity-0'
                    }`}
                    onLoad={()=> setLogoLoaded(true)}
                    onError={()=> setLogoError(true)}
                  />
                ) : (
                  <div className="w-full h-full bg-coffee-600 flex items-center justify-center text-white font-bold text-lg">
                    ☕
                  </div>
                )}
                {!logoLoaded && !logoError && (
                  <div className="absolute inset-0 bg-coffee-100 animate-pulse" />
                )}
              </motion.div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              {navLinks.map((link)=> (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-medium transition-colors relative group ${
                    location.pathname===link.to
                      ? 'text-coffee-600'
                      : 'text-gray-700 hover:text-coffee-600'
                  }`}
                >
                  {link.label}
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-0.5 bg-coffee-600"
                    initial={{scaleX: 0}}
                    animate={{scaleX: location.pathname===link.to ? 1 : 0}}
                    whileHover={{scaleX: 1}}
                    transition={{duration: 0.2}}
                  />
                </Link>
              ))}
            </nav>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="hidden lg:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e)=> setSearchQuery(e.target.value)}
                  className="w-64 pl-10 pr-4 py-2 border border-coffee-200 rounded-full focus:outline-none focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
                />
                <SafeIcon
                  icon={FiSearch}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400 w-4 h-4"
                />
              </div>
            </form>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Wishlist */}
              <Link to="/wishlist" className="relative group">
                <motion.div
                  whileHover={{scale: 1.1}}
                  whileTap={{scale: 0.95}}
                  className="p-2 text-coffee-600 hover:text-coffee-800 transition-colors"
                >
                  <SafeIcon icon={FiHeart} className="w-6 h-6" />
                  {wishlistCount > 0 && (
                    <motion.span
                      initial={{scale: 0}}
                      animate={{scale: 1}}
                      className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </motion.div>
              </Link>

              {/* Cart */}
              <button onClick={toggleCart} className="relative group">
                <motion.div
                  whileHover={{scale: 1.1}}
                  whileTap={{scale: 0.95}}
                  className="p-2 text-coffee-600 hover:text-coffee-800 transition-colors"
                >
                  <SafeIcon icon={FiShoppingCart} className="w-6 h-6" />
                  {cartItemsCount > 0 && (
                    <motion.span
                      initial={{scale: 0}}
                      animate={{scale: 1}}
                      className="absolute -top-1 -right-1 bg-coffee-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
                    >
                      {cartItemsCount}
                    </motion.span>
                  )}
                </motion.div>
              </button>

              {/* User Menu */}
              <div className="relative user-menu">
                <button
                  onClick={()=> setIsUserMenuOpen(!isUserMenuOpen)}
                  className="flex items-center space-x-2 p-2 text-coffee-600 hover:text-coffee-800 transition-colors"
                >
                  <SafeIcon icon={FiUser} className="w-6 h-6" />
                  {user && (
                    <span className="hidden sm:block text-sm font-medium">
                      {user.name || user.username}
                    </span>
                  )}
                </button>

                <AnimatePresence>
                  {isUserMenuOpen && (
                    <motion.div
                      initial={{opacity: 0,scale: 0.95,y: -10}}
                      animate={{opacity: 1,scale: 1,y: 0}}
                      exit={{opacity: 0,scale: 0.95,y: -10}}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2"
                    >
                      {user ? (
                        <>
                          <Link
                            to="/account"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-coffee-50 transition-colors"
                            onClick={()=> setIsUserMenuOpen(false)}
                          >
                            My Account
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-coffee-50 transition-colors flex items-center gap-2"
                          >
                            <SafeIcon icon={FiLogOut} className="w-4 h-4" />
                            Logout
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            to="/login"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-coffee-50 transition-colors"
                            onClick={()=> setIsUserMenuOpen(false)}
                          >
                            Login
                          </Link>
                          <Link
                            to="/register"
                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-coffee-50 transition-colors"
                            onClick={()=> setIsUserMenuOpen(false)}
                          >
                            Register
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={()=> setIsMobileMenuOpen(true)}
                className="md:hidden p-2 text-coffee-600 hover:text-coffee-800 transition-colors"
              >
                <SafeIcon icon={FiMenu} className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={()=> setIsMobileMenuOpen(false)}
        navLinks={navLinks}
        logo={logoUrl}
      />

      {/* Cart Sidebar */}
      <CartSidebar />
    </>
  );
};

export default Header;