import supabase from '../lib/supabase';

// Get all products with optional filtering
export const getProducts = async (filters = {}) => {
  try {
    let query = supabase
      .from('products_cogli234')
      .select('*');
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      query = query.eq('category', filters.category);
    }
    
    // Apply price range filter
    if (filters.priceRange) {
      query = query
        .gte('price', filters.priceRange[0])
        .lte('price', filters.priceRange[1]);
    }
    
    // Apply search filter
    if (filters.search) {
      query = query.ilike('name', `%${filters.search}%`);
    }
    
    // Get featured products
    if (filters.featured) {
      query = query.eq('featured', true);
    }
    
    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case 'price-low':
          query = query.order('price', { ascending: true });
          break;
        case 'price-high':
          query = query.order('price', { ascending: false });
          break;
        case 'rating':
          query = query.order('rating', { ascending: false });
          break;
        case 'name':
        default:
          query = query.order('name', { ascending: true });
          break;
      }
    } else {
      // Default sorting
      query = query.order('created_at', { ascending: false });
    }
    
    // Apply pagination
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }
    
    const { data, error } = await query;
    
    if (error) {
      throw error;
    }
    
    return { products: data || [] };
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

// Get a single product by ID
export const getProductById = async (id) => {
  try {
    const { data, error } = await supabase
      .from('products_cogli234')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error getting product:', error);
    throw error;
  }
};

// Get related products
export const getRelatedProducts = async (productId, category, limit = 4) => {
  try {
    const { data, error } = await supabase
      .from('products_cogli234')
      .select('*')
      .eq('category', category)
      .neq('id', productId)
      .limit(limit);
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error getting related products:', error);
    throw error;
  }
};

// Create a new product (admin only)
export const createProduct = async (productData) => {
  try {
    const { data, error } = await supabase
      .from('products_cogli234')
      .insert([productData])
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

// Update a product (admin only)
export const updateProduct = async (id, productData) => {
  try {
    const { data, error } = await supabase
      .from('products_cogli234')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Delete a product (admin only)
export const deleteProduct = async (id) => {
  try {
    const { error } = await supabase
      .from('products_cogli234')
      .delete()
      .eq('id', id);
    
    if (error) {
      throw error;
    }
    
    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// Upload product image
export const uploadProductImage = async (file, path) => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${path}/${fileName}`;
    
    const { data, error } = await supabase.storage
      .from('product-images')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });
    
    if (error) {
      throw error;
    }
    
    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('product-images')
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};