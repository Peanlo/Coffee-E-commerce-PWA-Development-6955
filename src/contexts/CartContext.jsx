import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabase';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load cart from localStorage or database based on authentication
  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      
      try {
        if (user) {
          // Load from Supabase if user is logged in
          const { data, error } = await supabase
            .from('cart_items')
            .select(`
              id, 
              quantity, 
              products:product_id (
                id, 
                name, 
                price, 
                description, 
                image, 
                category, 
                rating, 
                in_stock
              )
            `)
            .eq('user_id', user.id);
          
          if (error) {
            throw error;
          }
          
          // Transform data to match our cart structure
          const formattedItems = data.map(item => ({
            id: item.products.id,
            name: item.products.name,
            price: item.products.price,
            description: item.products.description,
            image: item.products.image,
            category: item.products.category,
            rating: item.products.rating,
            inStock: item.products.in_stock,
            quantity: item.quantity,
            cartItemId: item.id
          }));
          
          setCartItems(formattedItems);
        } else {
          // Load from localStorage if user is not logged in
          const savedCart = localStorage.getItem('cartItems');
          if (savedCart) {
            setCartItems(JSON.parse(savedCart));
          }
        }
      } catch (error) {
        console.error('Error loading cart:', error);
        toast.error('Failed to load your cart');
      } finally {
        setLoading(false);
      }
    };
    
    loadCart();
  }, [user]);

  // Save cart to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
    }
  }, [cartItems, user]);

  // Add item to cart
  const addToCart = async (product, quantity = 1) => {
    try {
      const existingItem = cartItems.find(item => item.id === product.id);
      
      if (user) {
        // Save to database if user is logged in
        if (existingItem) {
          // Update quantity
          const newQuantity = existingItem.quantity + quantity;
          
          const { error } = await supabase
            .from('cart_items')
            .update({ quantity: newQuantity })
            .eq('id', existingItem.cartItemId);
            
          if (error) throw error;
          
          setCartItems(prevItems => 
            prevItems.map(item => 
              item.id === product.id 
                ? { ...item, quantity: newQuantity } 
                : item
            )
          );
        } else {
          // Add new item
          const { data, error } = await supabase
            .from('cart_items')
            .insert({
              user_id: user.id,
              product_id: product.id,
              quantity: quantity
            })
            .select('id')
            .single();
            
          if (error) throw error;
          
          setCartItems(prevItems => [
            ...prevItems, 
            { 
              ...product, 
              quantity, 
              cartItemId: data.id 
            }
          ]);
        }
      } else {
        // Save to localStorage if user is not logged in
        if (existingItem) {
          setCartItems(prevItems => 
            prevItems.map(item => 
              item.id === product.id 
                ? { ...item, quantity: item.quantity + quantity } 
                : item
            )
          );
        } else {
          setCartItems(prevItems => [
            ...prevItems, 
            { ...product, quantity }
          ]);
        }
      }
      
      toast.success(`Added ${product.name} to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Remove item from cart
  const removeFromCart = async (productId) => {
    try {
      const item = cartItems.find(item => item.id === productId);
      
      if (!item) return;
      
      if (user) {
        // Remove from database if user is logged in
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('id', item.cartItemId);
          
        if (error) throw error;
      }
      
      setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
      toast.success(`Removed item from cart`);
    } catch (error) {
      console.error('Error removing from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  // Update item quantity
  const updateQuantity = async (productId, quantity) => {
    try {
      if (quantity <= 0) {
        return removeFromCart(productId);
      }
      
      const item = cartItems.find(item => item.id === productId);
      
      if (!item) return;
      
      if (user) {
        // Update in database if user is logged in
        const { error } = await supabase
          .from('cart_items')
          .update({ quantity })
          .eq('id', item.cartItemId);
          
        if (error) throw error;
      }
      
      setCartItems(prevItems => 
        prevItems.map(item => 
          item.id === productId 
            ? { ...item, quantity } 
            : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast.error('Failed to update quantity');
    }
  };

  // Clear cart
  const clearCart = async () => {
    try {
      if (user) {
        // Clear from database if user is logged in
        const { error } = await supabase
          .from('cart_items')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
      
      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  // Migrate cart from localStorage to database after login
  const migrateCart = async (userId) => {
    try {
      const localCart = JSON.parse(localStorage.getItem('cartItems') || '[]');
      
      if (localCart.length === 0) return;
      
      // Format cart items for database
      const cartItemsForDb = localCart.map(item => ({
        user_id: userId,
        product_id: item.id,
        quantity: item.quantity
      }));
      
      // Insert into database
      const { error } = await supabase
        .from('cart_items')
        .insert(cartItemsForDb);
        
      if (error) throw error;
      
      // Clear localStorage
      localStorage.removeItem('cartItems');
    } catch (error) {
      console.error('Error migrating cart:', error);
    }
  };

  // Calculate total
  const getCartTotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Count items
  const getCartItemsCount = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  // Toggle cart sidebar
  const toggleCart = () => {
    setIsOpen(!isOpen);
  };

  const value = {
    cartItems,
    isOpen,
    loading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    toggleCart,
    setIsOpen,
    migrateCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};