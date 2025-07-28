import React,{useState} from 'react';
import {Link,useNavigate} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import {useAuth} from '../../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import toast from 'react-hot-toast';

const {FiUser,FiMail,FiLock,FiAlertCircle,FiLoader}=FiIcons;

const RegisterForm=()=> {
  const [formData,setFormData]=useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const navigate=useNavigate();
  const {register}=useAuth();

  // Updated Logo URL
  const logoUrl='https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753101906746-Cogli%20Caffe%20Side%20By%20Side.png';

  const handleChange=(e)=> {
    const {name,value}=e.target;
    setFormData(prev=> ({...prev,[name]: value}));
  };

  const validateForm=()=> {
    if (formData.password !==formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long');
      return false;
    }
    return true;
  };

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const {success,error}=await register(formData);
      if (success) {
        toast.success('Account created successfully!');
        navigate('/');
      } else {
        setError(error || 'Failed to create account');
      }
    } catch (err) {
      setError('An unexpected error occurred');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{opacity: 0,y: 20}}
      animate={{opacity: 1,y: 0}}
      className="bg-white rounded-lg shadow-lg p-8"
    >
      <div className="text-center mb-8">
        <img
          src={logoUrl}
          alt="Cogli Caffe"
          className="h-16 mx-auto mb-4"
        />
        <h2 className="text-2xl font-bold text-coffee-800">Create an Account</h2>
        <p className="text-coffee-600 mt-2">Join our coffee-loving community</p>
      </div>

      {error && (
        <motion.div
          initial={{opacity: 0,height: 0}}
          animate={{opacity: 1,height: 'auto'}}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded mb-6"
        >
          <div className="flex">
            <SafeIcon icon={FiAlertCircle} className="w-5 h-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </motion.div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-coffee-700 mb-1">
            Full Name
          </label>
          <div className="relative">
            <SafeIcon
              icon={FiUser}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
            />
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              placeholder="John Doe"
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-coffee-700 mb-1">
            Email
          </label>
          <div className="relative">
            <SafeIcon
              icon={FiMail}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
            />
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-coffee-700 mb-1">
            Password
          </label>
          <div className="relative">
            <SafeIcon
              icon={FiLock}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
            />
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
          <p className="mt-1 text-xs text-gray-500">
            Password must be at least 8 characters long
          </p>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-coffee-700 mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <SafeIcon
              icon={FiLock}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
            />
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center btn-coffee py-3"
        >
          {loading ? (
            <>
              <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-coffee-600 hover:text-coffee-800 font-medium"
          >
            Sign in
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default RegisterForm;