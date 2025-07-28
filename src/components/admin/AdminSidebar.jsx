import React from 'react';
import {Link,useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiHome,FiPackage,FiShoppingBag,FiUsers,FiSettings,FiBarChart2,FiLogOut,FiHelpCircle}=FiIcons;

const AdminSidebar=({onLogout})=> {
  const location=useLocation();
  const pathname=location.pathname;

  // Updated Logo URL
  const logoUrl='https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753101906746-Cogli%20Caffe%20Side%20By%20Side.png';

  const menuItems=[
    {path: '/admin',icon: FiHome,label: 'Dashboard'},
    {path: '/admin/products',icon: FiPackage,label: 'Products'},
    {path: '/admin/orders',icon: FiShoppingBag,label: 'Orders'},
    {path: '/admin/users',icon: FiUsers,label: 'Users'},
    {path: '/admin/analytics',icon: FiBarChart2,label: 'Analytics'},
    {path: '/admin/settings',icon: FiSettings,label: 'Settings'},
    {path: '/admin/help',icon: FiHelpCircle,label: 'Help & Manual',highlight: true},
  ];

  const isActive=(path)=> {
    if (path==='/admin') {
      return pathname==='/admin';
    }
    return pathname.startsWith(path);
  };

  return (
    <div className="bg-coffee-800 text-white h-full min-h-screen flex flex-col">
      {/* Logo */}
      <Link to="/admin" className="flex items-center px-6 py-6 border-b border-coffee-700">
        <div className="w-10 h-10 bg-coffee-600 rounded-full flex items-center justify-center mr-3">
          <span className="text-white font-bold text-lg">☕</span>
        </div>
        <div>
          <h1 className="text-xl font-bold">Cogli Caffe</h1>
          <p className="text-xs text-coffee-300">Admin Panel</p>
        </div>
      </Link>

      {/* Navigation Menu */}
      <nav className="flex-1 py-6">
        <ul className="space-y-1">
          {menuItems.map((item)=> (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-6 py-3 ${
                  isActive(item.path)
                    ? 'bg-coffee-700 border-l-4 border-cream-200'
                    : 'hover:bg-coffee-700 border-l-4 border-transparent'
                } ${item.highlight ? 'text-cream-200' : 'text-gray-100'}`}
              >
                <SafeIcon
                  icon={item.icon}
                  className={`w-5 h-5 mr-3 ${item.highlight ? 'text-cream-200' : ''}`}
                />
                <span>{item.label}</span>
                {item.highlight && (
                  <motion.span
                    initial={{opacity: 0}}
                    animate={{opacity: 1}}
                    transition={{delay: 0.5,duration: 0.5,repeat: Infinity,repeatType: "reverse"}}
                    className="ml-2 px-1.5 py-0.5 bg-cream-200 text-coffee-800 text-xs rounded-full"
                  >
                    New
                  </motion.span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-coffee-700">
        <button
          onClick={onLogout}
          className="flex items-center w-full px-6 py-3 text-gray-100 hover:bg-coffee-700 rounded-lg"
        >
          <SafeIcon icon={FiLogOut} className="w-5 h-5 mr-3" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default AdminSidebar;