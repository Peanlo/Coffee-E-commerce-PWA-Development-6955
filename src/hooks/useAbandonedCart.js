import { useEffect } from 'react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { checkForAbandonedCart } from '../services/abandonedCartService';

export const useAbandonedCart = () => {
  const { cartItems, getCartTotal } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    let timeoutId;

    const checkAbandonment = () => {
      if (user && cartItems.length > 0) {
        checkForAbandonedCart(user.id, cartItems, getCartTotal());
      }
    };

    // Check for cart abandonment after 30 minutes of inactivity
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(checkAbandonment, 30 * 60 * 1000);
    };

    // Reset timer on user activity
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);

    // Start initial timer
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
    };
  }, [user, cartItems, getCartTotal]);
};