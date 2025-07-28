import React,{useState} from 'react';
import {Link,useNavigate,useLocation} from 'react-router-dom';
import {motion} from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import {useAuth} from '../../contexts/AuthContext';
import SafeIcon from '../common/SafeIcon';
import toast from 'react-hot-toast';

const {FiMail,FiLock,FiAlertCircle,FiLoader}=FiIcons;

const LoginForm=()=> {
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const navigate=useNavigate();
  const location=useLocation();
  const {login}=useAuth();

  // Get redirect path from location state or default to home
  const from=location.state?.from || '/';

  // Updated Logo URL
  const logoUrl='https://quest-media-storage-bucket.s3.us-east-2.amazonaws.com/1753101906746-Cogli%20Caffe%20Side%20By%20Side.png';

  const handleSubmit=async (e)=> {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const {success,error}=await login(email,password);
      if (success) {
        toast.success('Login successful!');
        navigate(from,{replace: true});
      } else {
        setError(error || 'Failed to login');
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
        <h2 className="text-2xl font-bold text-coffee-800">Welcome Back</h2>
        <p className="text-coffee-600 mt-2">Sign in to your account to continue</p>
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
              type="email"
              value={email}
              onChange={(e)=> setEmail(e.target.value)}
              required
              className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              placeholder="your.email@example.com"
            />
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label htmlFor="password" className="block text-sm font-medium text-coffee-700">
              Password
            </label>
            <Link
              to="/forgot-password"
              className="text-sm text-coffee-600 hover:text-coffee-800"
            >
              Forgot Password?
            </Link>
          </div>
          <div className="relative">
            <SafeIcon
              icon={FiLock}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
            />
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e)=> setPassword(e.target.value)}
              required
              className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            id="remember-me"
            name="remember-me"
            type="checkbox"
            className="h-4 w-4 text-coffee-600 focus:ring-coffee-500 border-coffee-300 rounded"
          />
          <label htmlFor="remember-me" className="ml-2 block text-sm text-coffee-700">
            Remember me
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center btn-coffee py-3"
        >
          {loading ? (
            <>
              <SafeIcon icon={FiLoader} className="animate-spin mr-2" />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-6 text-center">
        <p className="text-gray-600">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="text-coffee-600 hover:text-coffee-800 font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </motion.div>
  );
};

export default LoginForm;