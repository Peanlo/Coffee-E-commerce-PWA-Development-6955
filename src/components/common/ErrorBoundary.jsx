import React from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from './SafeIcon';

const { FiAlertTriangle, FiRefreshCw, FiHome } = FiIcons;

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-coffee-50 to-cream-100 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-md w-full bg-white rounded-lg shadow-xl p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <SafeIcon icon={FiAlertTriangle} className="w-8 h-8 text-red-500" />
            </motion.div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Oops! Something went wrong
            </h1>
            
            <p className="text-gray-600 mb-6">
              We're sorry for the inconvenience. The application encountered an unexpected error.
            </p>
            
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full btn-coffee flex items-center justify-center gap-2"
              >
                <SafeIcon icon={FiRefreshCw} className="w-4 h-4" />
                Reload Page
              </button>
              
              <button
                onClick={() => window.location.href = '/'}
                className="w-full border border-coffee-300 text-coffee-600 py-2 px-4 rounded-lg hover:bg-coffee-50 transition-colors flex items-center justify-center gap-2"
              >
                <SafeIcon icon={FiHome} className="w-4 h-4" />
                Go Home
              </button>
            </div>
            
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details className="mt-6 text-left">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Error Details (Development)
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto max-h-32">
                  {this.state.error && this.state.error.toString()}
                  <br />
                  {this.state.errorInfo.componentStack}
                </pre>
              </details>
            )}
          </motion.div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;