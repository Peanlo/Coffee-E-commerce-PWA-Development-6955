import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import * as FiIcons from 'react-icons/fi';
import SafeIcon from '../common/SafeIcon';
import { useAuth } from '../../contexts/AuthContext';

const { FiMapPin, FiUser, FiPhone, FiMail, FiHome, FiPlus, FiCheck } = FiIcons;

const ShippingForm = ({ onSubmit }) => {
  const { user } = useAuth();
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US'
  });
  const [errors, setErrors] = useState({});
  const [useNewAddress, setUseNewAddress] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch saved addresses from the database
    // For this demo, we'll use mock data
    if (user) {
      const mockAddresses = [
        {
          id: '1',
          firstName: user.name?.split(' ')[0] || 'John',
          lastName: user.name?.split(' ')[1] || 'Doe',
          email: user.email,
          phone: '555-123-4567',
          address1: '123 Coffee St',
          address2: 'Apt 4B',
          city: 'Seattle',
          state: 'WA',
          zip: '98101',
          country: 'US',
          is_default: true
        }
      ];
      
      setSavedAddresses(mockAddresses);
      if (mockAddresses.length > 0) {
        setUseNewAddress(false);
        setSelectedAddress(mockAddresses[0]);
      }
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};

    if (useNewAddress) {
      if (!formData.firstName) newErrors.firstName = 'First name is required';
      if (!formData.lastName) newErrors.lastName = 'Last name is required';
      if (!formData.email) newErrors.email = 'Email is required';
      if (!formData.phone) newErrors.phone = 'Phone number is required';
      if (!formData.address1) newErrors.address1 = 'Address is required';
      if (!formData.city) newErrors.city = 'City is required';
      if (!formData.state) newErrors.state = 'State is required';
      if (!formData.zip) newErrors.zip = 'ZIP code is required';

      if (formData.zip && !/^\d{5}(-\d{4})?$/.test(formData.zip)) {
        newErrors.zip = 'Invalid ZIP code format';
      }

      if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Invalid email format';
      }

      if (formData.phone && !/^\+?[\d\s-]{10,}$/.test(formData.phone)) {
        newErrors.phone = 'Invalid phone number format';
      }
    } else if (!selectedAddress) {
      newErrors.address = 'Please select a shipping address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const shippingDetails = useNewAddress ? formData : selectedAddress;
      onSubmit(shippingDetails);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {savedAddresses.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-coffee-800">Saved Addresses</h3>
            <button
              type="button"
              onClick={() => setUseNewAddress(!useNewAddress)}
              className="text-coffee-600 hover:text-coffee-800 flex items-center gap-2"
            >
              <SafeIcon icon={useNewAddress ? FiHome : FiPlus} className="w-4 h-4" />
              {useNewAddress ? 'Use Saved Address' : 'Add New Address'}
            </button>
          </div>

          {!useNewAddress && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {savedAddresses.map((address) => (
                <motion.div
                  key={address.id}
                  whileHover={{ scale: 1.02 }}
                  className={`p-4 border-2 rounded-lg cursor-pointer ${
                    selectedAddress?.id === address.id
                      ? 'border-coffee-600 bg-coffee-50'
                      : 'border-gray-200 hover:border-coffee-300'
                  }`}
                  onClick={() => setSelectedAddress(address)}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">
                      {address.firstName} {address.lastName}
                    </span>
                    {selectedAddress?.id === address.id && (
                      <SafeIcon icon={FiCheck} className="w-5 h-5 text-coffee-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">
                    {address.address1} {address.address2 && `, ${address.address2}`}
                  </p>
                  <p className="text-sm text-gray-600">
                    {address.city}, {address.state} {address.zip}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {useNewAddress && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                First Name *
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiUser}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
                />
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, firstName: e.target.value }))
                  }
                  className={`pl-10 w-full py-3 border rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                    errors.firstName ? 'border-red-500' : 'border-coffee-200'
                  }`}
                />
              </div>
              {errors.firstName && (
                <p className="mt-1 text-sm text-red-500">{errors.firstName}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Last Name *
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiUser}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
                />
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, lastName: e.target.value }))
                  }
                  className={`pl-10 w-full py-3 border rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                    errors.lastName ? 'border-red-500' : 'border-coffee-200'
                  }`}
                />
              </div>
              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Email *
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiMail}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
                />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  className={`pl-10 w-full py-3 border rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                    errors.email ? 'border-red-500' : 'border-coffee-200'
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-500">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                Phone *
              </label>
              <div className="relative">
                <SafeIcon
                  icon={FiPhone}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
                />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  className={`pl-10 w-full py-3 border rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                    errors.phone ? 'border-red-500' : 'border-coffee-200'
                  }`}
                  placeholder="(123) 456-7890"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-coffee-700 mb-1">
              Address Line 1 *
            </label>
            <div className="relative">
              <SafeIcon
                icon={FiMapPin}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
              />
              <input
                type="text"
                value={formData.address1}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address1: e.target.value }))
                }
                className={`pl-10 w-full py-3 border rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                  errors.address1 ? 'border-red-500' : 'border-coffee-200'
                }`}
              />
            </div>
            {errors.address1 && (
              <p className="mt-1 text-sm text-red-500">{errors.address1}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-coffee-700 mb-1">
              Address Line 2
            </label>
            <div className="relative">
              <SafeIcon
                icon={FiMapPin}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-coffee-400"
              />
              <input
                type="text"
                value={formData.address2}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address2: e.target.value }))
                }
                className="pl-10 w-full py-3 border border-coffee-200 rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="col-span-2">
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                City *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, city: e.target.value }))
                }
                className={`w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                  errors.city ? 'border-red-500' : 'border-coffee-200'
                }`}
              />
              {errors.city && (
                <p className="mt-1 text-sm text-red-500">{errors.city}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                State *
              </label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, state: e.target.value }))
                }
                className={`w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                  errors.state ? 'border-red-500' : 'border-coffee-200'
                }`}
                maxLength={2}
                placeholder="CA"
              />
              {errors.state && (
                <p className="mt-1 text-sm text-red-500">{errors.state}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-coffee-700 mb-1">
                ZIP Code *
              </label>
              <input
                type="text"
                value={formData.zip}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, zip: e.target.value }))
                }
                className={`w-full py-3 px-4 border rounded-lg focus:ring-2 focus:ring-coffee-500 focus:border-transparent ${
                  errors.zip ? 'border-red-500' : 'border-coffee-200'
                }`}
                maxLength={10}
                placeholder="12345"
              />
              {errors.zip && <p className="mt-1 text-sm text-red-500">{errors.zip}</p>}
            </div>
          </div>
        </div>
      )}

      <button
        type="submit"
        className="w-full btn-coffee py-3 flex items-center justify-center gap-2"
      >
        Continue to Payment
      </button>
    </form>
  );
};

export default ShippingForm;