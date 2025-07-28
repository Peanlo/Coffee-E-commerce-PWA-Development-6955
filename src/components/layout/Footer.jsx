import React from 'react';
import {Link} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';

const {FiMail,FiPhone,FiMapPin,FiFacebook,FiTwitter,FiInstagram}=FiIcons;

const Footer=()=> {
  const currentYear=new Date().getFullYear();
  
  // Updated Logo URL
  const logoUrl='https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753101906746-Cogli%20Caffe%20Side%20By%20Side.png';

  const footerLinks={
    'Quick Links': [
      {to: '/',label: 'Home'},
      {to: '/products',label: 'Products'},
      {to: '/contact',label: 'Contact'},
      {to: '/cart',label: 'Cart'}
    ],
    'Customer Service': [
      {to: '/contact',label: 'Contact Us'},
      {to: '/terms',label: 'Terms of Service'},
      {to: '/privacy',label: 'Privacy Policy'},
      {to: '/account',label: 'My Account'}
    ],
    'Company': [
      {to: '/about',label: 'About Us'},
      {to: '/careers',label: 'Careers'},
      {to: '/blog',label: 'Blog'},
      {to: '/press',label: 'Press'}
    ]
  };

  const socialLinks=[
    {icon: FiFacebook,href: '#',label: 'Facebook'},
    {icon: FiTwitter,href: '#',label: 'Twitter'},
    {icon: FiInstagram,href: '#',label: 'Instagram'}
  ];

  return (
    <footer className="bg-coffee-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand Section */}
          <motion.div
            initial={{opacity: 0,y: 20}}
            whileInView={{opacity: 1,y: 0}}
            viewport={{once: true}}
            className="lg:col-span-1"
          >
            <Link to="/" className="block mb-4">
              <img
                src={logoUrl}
                alt="Cogli Caffe"
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-coffee-300 mb-6 max-w-xs">
              Discover our carefully curated selection of premium coffee beans and artisanal merchandise.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiMail} className="w-4 h-4 text-coffee-400" />
                <a
                  href="mailto:hello@coglicaffe.com"
                  className="text-coffee-300 hover:text-white transition-colors"
                >
                  hello@coglicaffe.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <SafeIcon icon={FiPhone} className="w-4 h-4 text-coffee-400" />
                <a
                  href="tel:8773600088"
                  className="text-coffee-300 hover:text-white transition-colors"
                >
                  (877) 360-0088
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <SafeIcon icon={FiMapPin} className="w-4 h-4 text-coffee-400 mt-0.5" />
                <address className="text-coffee-300 not-italic text-sm">
                  4736 Royal Ave, #17170<br />
                  Eugene, OR 97402<br />
                  United States
                </address>
              </div>
            </div>
          </motion.div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category,links],index)=> (
            <motion.div
              key={category}
              initial={{opacity: 0,y: 20}}
              whileInView={{opacity: 1,y: 0}}
              viewport={{once: true}}
              transition={{delay: index * 0.1}}
              className="lg:col-span-1"
            >
              <h4 className="text-lg font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link)=> (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-coffee-300 hover:text-white transition-colors text-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Section */}
        <motion.div
          initial={{opacity: 0,y: 20}}
          whileInView={{opacity: 1,y: 0}}
          viewport={{once: true}}
          className="border-t border-coffee-700 mt-12 pt-8"
        >
          <div className="flex flex-col sm:flex-row justify-between items-center">
            <p className="text-coffee-400 text-sm mb-4 sm:mb-0">
              © {currentYear} Cogli Caffe. All rights reserved.
            </p>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              <span className="text-coffee-400 text-sm mr-2">Follow us:</span>
              {socialLinks.map((social)=> (
                <motion.a
                  key={social.label}
                  href={social.href}
                  whileHover={{scale: 1.2}}
                  whileTap={{scale: 0.9}}
                  className="text-coffee-400 hover:text-white transition-colors"
                  aria-label={social.label}
                >
                  <SafeIcon icon={social.icon} className="w-5 h-5" />
                </motion.a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;