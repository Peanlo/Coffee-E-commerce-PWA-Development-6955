import React, { useState } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { validateCoupon, calculateDiscount } from '../../services/couponService';
import toast from 'react-hot-toast';

const { FiTag, FiCheck, FiX, FiLoader } = FiIcons;

const CouponForm = ({ total, onApplyCoupon }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;

    setLoading(true);
    try {
      const result = await validateCoupon(code);
      if (result.valid) {
        const discountAmount = calculateDiscount(total, result.coupon);
        if (discountAmount === 0) {
          toast.error('Minimum purchase requirement not met');
          return;
        }
        setAppliedCoupon(result.coupon);
        onApplyCoupon(result.coupon, discountAmount);
        toast.success('Coupon applied successfully!');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Failed to apply coupon');
    } finally {
      setLoading(false);
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCode('');
    onApplyCoupon(null, 0);
    toast.success('Coupon removed');
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-coffee-800 mb-3">
        Discount Code
      </h3>
      
      {appliedCoupon ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 flex justify-between items-center"
        >
          <div className="flex items-center">
            <SafeIcon icon={FiCheck} className="w-5 h-5 text-green-500 mr-2" />
            <div>
              <p className="font-medium text-green-800">{appliedCoupon.code}</p>
              <p className="text-sm text-green-600">
                {appliedCoupon.discount_type === 'percentage' 
                  ? `${appliedCoupon.discount_value}% off`
                  : `$${appliedCoupon.discount_value} off`}
              </p>
            </div>
          </div>
          <button
            onClick={removeCoupon}
            className="text-red-500 hover:text-red-700 transition-colors"
          >
            <SafeIcon icon={FiX} className="w-5 h-5" />
          </button>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <SafeIcon
              icon={FiTag}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
            />
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Enter discount code"
              className="w-full pl-10 pr-4 py-2 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              disabled={loading}
            />
          </div>
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="px-4 py-2 bg-coffee-600 text-white rounded-lg hover:bg-coffee-700 disabled:bg-coffee-300 transition-colors flex items-center"
          >
            {loading ? (
              <SafeIcon icon={FiLoader} className="w-5 h-5 animate-spin" />
            ) : (
              'Apply'
            )}
          </button>
        </form>
      )}
    </div>
  );
};

export default CouponForm;