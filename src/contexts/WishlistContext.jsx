import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from './AuthContext';
import supabase from '../lib/supabase';

const WishlistContext = createContext();

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  // Load wishlist
  useEffect(() => {
    const loadWishlist = async () => {
      setLoading(true);
      
      try {
        if (user) {
          // Load from Supabase if user is logged in
          const { data, error } = await supabase
            .from('wishlist_items')
            .select(`
              id, 
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
          
          // Transform data to match our wishlist structure
          const formattedItems = data.map(item => ({
            id: item.products.id,
            name: item.products.name,
            price: item.products.price,
            description: item.products.description,
            image: item.products.image,
            category: item.products.category,
            rating: item.products.rating,
            inStock: item.products.in_stock,
            wishlistItemId: item.id
          }));
          
          setWishlistItems(formattedItems);
        } else {
          // Load from localStorage if user is not logged in
          const savedWishlist = localStorage.getItem('wishlistItems');
          if (savedWishlist) {
            setWishlistItems(JSON.parse(savedWishlist));
          }
        }
      } catch (error) {
        console.error('Error loading wishlist:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadWishlist();
  }, [user]);

  // Save wishlist to localStorage when not logged in
  useEffect(() => {
    if (!user) {
      localStorage.setItem('wishlistItems', JSON.stringify(wishlistItems));
    }
  }, [wishlistItems, user]);

  // Add item to wishlist
  const addToWishlist = async (product) => {
    try {
      if (isInWishlist(product.id)) {
        toast.error(`${product.name} is already in wishlist`);
        return;
      }
      
      if (user) {
        // Save to database if user is logged in
        const { data, error } = await supabase
          .from('wishlist_items')
          .insert({
            user_id: user.id,
            product_id: product.id
          })
          .select('id')
          .single();
          
        if (error) throw error;
        
        setWishlistItems(prevItems => [
          ...prevItems, 
          { 
            ...product, 
            wishlistItemId: data.id 
          }
        ]);
      } else {
        // Save to localStorage if user is not logged in
        setWishlistItems(prevItems => [...prevItems, product]);
      }
      
      toast.success(`Added ${product.name} to wishlist`);
    } catch (error) {
      console.error('Error adding to wishlist:', error);
      toast.error('Failed to add item to wishlist');
    }
  };

  // Remove from wishlist
  const removeFromWishlist = async (productId) => {
    try {
      const item = wishlistItems.find(item => item.id === productId);
      
      if (!item) return;
      
      if (user) {
        // Remove from database if user is logged in
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('id', item.wishlistItemId);
          
        if (error) throw error;
      }
      
      setWishlistItems(prevItems => prevItems.filter(item => item.id !== productId));
      toast.success(`Removed item from wishlist`);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove item from wishlist');
    }
  };

  // Check if item is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item.id === productId);
  };

  // Clear wishlist
  const clearWishlist = async () => {
    try {
      if (user) {
        // Clear from database if user is logged in
        const { error } = await supabase
          .from('wishlist_items')
          .delete()
          .eq('user_id', user.id);
          
        if (error) throw error;
      }
      
      setWishlistItems([]);
      toast.success('Wishlist cleared');
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      toast.error('Failed to clear wishlist');
    }
  };

  // Migrate wishlist from localStorage to database after login
  const migrateWishlist = async (userId) => {
    try {
      const localWishlist = JSON.parse(localStorage.getItem('wishlistItems') || '[]');
      
      if (localWishlist.length === 0) return;
      
      // Format wishlist items for database
      const wishlistItemsForDb = localWishlist.map(item => ({
        user_id: userId,
        product_id: item.id
      }));
      
      // Insert into database
      const { error } = await supabase
        .from('wishlist_items')
        .insert(wishlistItemsForDb);
        
      if (error) throw error;
      
      // Clear localStorage
      localStorage.removeItem('wishlistItems');
    } catch (error) {
      console.error('Error migrating wishlist:', error);
    }
  };

  const value = {
    wishlistItems,
    loading,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
    migrateWishlist
  };

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
};