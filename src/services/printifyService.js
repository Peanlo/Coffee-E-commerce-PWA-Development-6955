import axios from 'axios';
import supabase from '../lib/supabase';

// Printify API configuration
const PRINTIFY_API_URL = 'https://api.printify.com/v1';
let PRINTIFY_SHOP_ID = '';

// Get API key from secure storage
const getPrintifyApiKey = async () => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'printify_api_key')
      .single();

    if (error) throw error;
    return data.value;
  } catch (error) {
    console.error('Error fetching Printify API key:', error);
    throw new Error('Failed to fetch Printify API key');
  }
};

// Get shop ID from secure storage
const getPrintifyShopId = async () => {
  try {
    const { data, error } = await supabase
      .from('app_settings')
      .select('value')
      .eq('key', 'printify_shop_id')
      .single();

    if (error) throw error;
    PRINTIFY_SHOP_ID = data.value;
    return data.value;
  } catch (error) {
    console.error('Error fetching Printify shop ID:', error);
    throw new Error('Failed to fetch Printify shop ID');
  }
};

// Create Printify API client
const createPrintifyClient = async () => {
  const apiKey = await getPrintifyApiKey();
  const shopId = await getPrintifyShopId();

  return {
    client: axios.create({
      baseURL: PRINTIFY_API_URL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    }),
    shopId
  };
};

// Get all products from Printify
export const getPrintifyProducts = async () => {
  try {
    const { client, shopId } = await createPrintifyClient();
    const response = await client.get(`/shops/${shopId}/products.json`);
    return response.data;
  } catch (error) {
    console.error('Error getting Printify products:', error);
    throw error;
  }
};

// Get a single product from Printify
export const getPrintifyProduct = async (productId) => {
  try {
    const { client, shopId } = await createPrintifyClient();
    const response = await client.get(`/shops/${shopId}/products/${productId}.json`);
    return response.data;
  } catch (error) {
    console.error('Error getting Printify product:', error);
    throw error;
  }
};

// Create a new order in Printify
export const createPrintifyOrder = async (orderData) => {
  try {
    const { client, shopId } = await createPrintifyClient();
    const response = await client.post(`/shops/${shopId}/orders.json`, orderData);
    
    // Save order details to our database
    await savePrintifyOrderToDb(response.data.id, orderData, response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error creating Printify order:', error);
    throw error;
  }
};

// Save Printify order details to our database
const savePrintifyOrderToDb = async (printifyOrderId, requestData, responseData) => {
  try {
    await supabase
      .from('printify_orders')
      .insert([{
        printify_order_id: printifyOrderId,
        shop_id: PRINTIFY_SHOP_ID,
        request_data: requestData,
        response_data: responseData,
        status: responseData.status || 'created',
        created_at: new Date().toISOString()
      }]);
  } catch (error) {
    console.error('Error saving Printify order to database:', error);
    // Don't throw here, just log the error
  }
};

// Get order details from Printify with real-time status
export const getPrintifyOrderDetails = async (printifyOrderId) => {
  try {
    const { client, shopId } = await createPrintifyClient();
    const response = await client.get(`/shops/${shopId}/orders/${printifyOrderId}.json`);
    
    // Update order status in our database
    await updatePrintifyOrderStatus(printifyOrderId, response.data.status);
    
    // If order has shipments, update shipping info
    if (response.data.shipments && response.data.shipments.length > 0) {
      for (const shipment of response.data.shipments) {
        await savePrintifyShippingToDb(printifyOrderId, {
          carrier: shipment.carrier,
          service: shipment.service,
          tracking_number: shipment.tracking_number,
          tracking_url: shipment.tracking_url
        });
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('Error getting Printify order details:', error);
    throw error;
  }
};

// Update order status in our database
const updatePrintifyOrderStatus = async (printifyOrderId, status) => {
  try {
    await supabase
      .from('printify_orders')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('printify_order_id', printifyOrderId);
  } catch (error) {
    console.error('Error updating Printify order status:', error);
    // Don't throw here, just log the error
  }
};

// Cancel an order in Printify
export const cancelPrintifyOrder = async (printifyOrderId) => {
  try {
    const { client, shopId } = await createPrintifyClient();
    const response = await client.post(`/shops/${shopId}/orders/${printifyOrderId}/cancel.json`);
    
    // Update order status in our database
    await updatePrintifyOrderStatus(printifyOrderId, 'canceled');
    
    return response.data;
  } catch (error) {
    console.error('Error canceling Printify order:', error);
    throw error;
  }
};

// Get shipping information for an order
export const getPrintifyShipping = async (printifyOrderId) => {
  try {
    const { client, shopId } = await createPrintifyClient();
    const response = await client.get(`/shops/${shopId}/orders/${printifyOrderId}/shipping.json`);
    
    // Save shipping details to our database
    await savePrintifyShippingToDb(printifyOrderId, response.data);
    
    return response.data;
  } catch (error) {
    console.error('Error getting Printify shipping:', error);
    throw error;
  }
};

// Save shipping details to our database
const savePrintifyShippingToDb = async (printifyOrderId, shippingData) => {
  try {
    // Check if shipping record already exists
    const { data: existing } = await supabase
      .from('printify_shipping')
      .select('id')
      .eq('printify_order_id', printifyOrderId)
      .eq('tracking_number', shippingData.tracking_number)
      .single();

    if (!existing) {
      await supabase
        .from('printify_shipping')
        .insert([{
          printify_order_id: printifyOrderId,
          carrier: shippingData.carrier,
          service: shippingData.service,
          tracking_number: shippingData.tracking_number,
          tracking_url: shippingData.tracking_url,
          created_at: new Date().toISOString()
        }]);
    }
  } catch (error) {
    console.error('Error saving Printify shipping to database:', error);
    // Don't throw here, just log the error
  }
};

// Get order status by local order ID with Printify sync
export const getPrintifyOrderByLocalOrderId = async (localOrderId) => {
  try {
    // First, get the Printify order ID from our database
    const { data, error } = await supabase
      .from('orders')
      .select('printify_order_id')
      .eq('id', localOrderId)
      .single();

    if (error) throw error;

    if (!data.printify_order_id) {
      throw new Error('No Printify order associated with this order');
    }

    // Then get the order details from Printify
    return await getPrintifyOrderDetails(data.printify_order_id);
  } catch (error) {
    console.error('Error getting Printify order by local ID:', error);
    throw error;
  }
};

// Sync order status from Printify
export const syncPrintifyOrderStatus = async (localOrderId) => {
  try {
    const printifyOrder = await getPrintifyOrderByLocalOrderId(localOrderId);
    
    // Map Printify status to our order status
    const statusMapping = {
      'pending': 'paid',
      'in-production': 'processing',
      'fulfilled': 'shipped',
      'shipped': 'shipped',
      'delivered': 'delivered',
      'canceled': 'canceled'
    };

    const mappedStatus = statusMapping[printifyOrder.status] || 'processing';

    // Update our order status
    await supabase
      .from('orders')
      .update({ 
        status: mappedStatus,
        updated_at: new Date().toISOString()
      })
      .eq('id', localOrderId);

    return {
      printifyStatus: printifyOrder.status,
      localStatus: mappedStatus,
      shipments: printifyOrder.shipments || []
    };
  } catch (error) {
    console.error('Error syncing Printify order status:', error);
    throw error;
  }
};

// Format order data for Printify
export const formatPrintifyOrderData = (orderDetails, shippingAddress) => {
  return {
    external_id: orderDetails.id, // Our order ID
    line_items: orderDetails.items.map(item => ({
      product_id: item.printify_product_id,
      variant_id: item.printify_variant_id,
      quantity: item.quantity
    })),
    shipping_method: 1, // Standard shipping (you can make this dynamic)
    send_shipping_notification: true,
    address_to: {
      first_name: shippingAddress.first_name,
      last_name: shippingAddress.last_name,
      email: shippingAddress.email,
      phone: shippingAddress.phone,
      country: shippingAddress.country,
      region: shippingAddress.state,
      address1: shippingAddress.address1,
      address2: shippingAddress.address2 || '',
      city: shippingAddress.city,
      zip: shippingAddress.zip
    }
  };
};

// Webhook handler for Printify status updates
export const handlePrintifyWebhook = async (event) => {
  try {
    const { type, data } = event;

    switch (type) {
      case 'order:created':
      case 'order:updated':
      case 'order:fulfilled':
      case 'order:canceled':
        // Update order status in our database
        await updatePrintifyOrderStatus(data.id, data.status);

        // If the order was fulfilled, update shipping information
        if (type === 'order:fulfilled' && data.shipments && data.shipments.length > 0) {
          const shipment = data.shipments[0];
          await savePrintifyShippingToDb(data.id, {
            carrier: shipment.carrier,
            service: shipment.service,
            tracking_number: shipment.tracking_number,
            tracking_url: shipment.tracking_url
          });

          // Update the main order status
          await updateOrderStatus(data.external_id, 'shipped');
        }

        // If the order was canceled, update the main order status
        if (type === 'order:canceled') {
          await updateOrderStatus(data.external_id, 'canceled');
        }
        break;

      default:
        console.log(`Unhandled webhook event: ${type}`);
    }

    return { success: true };
  } catch (error) {
    console.error('Error handling Printify webhook:', error);
    throw error;
  }
};

// Update the status of an order in our database
const updateOrderStatus = async (orderId, status) => {
  try {
    await supabase
      .from('orders')
      .update({ 
        status, 
        updated_at: new Date().toISOString() 
      })
      .eq('id', orderId);
  } catch (error) {
    console.error('Error updating order status:', error);
    // Don't throw here, just log the error
  }
};

// Sync Printify products with our database
export const syncPrintifyProducts = async () => {
  try {
    const products = await getPrintifyProducts();

    for (const product of products) {
      const productDetails = await getPrintifyProduct(product.id);

      // Check if product already exists in our database
      const { data } = await supabase
        .from('products_cogli234')
        .select('id')
        .eq('printify_product_id', product.id)
        .maybeSingle();

      const productData = {
        name: product.title,
        description: product.description,
        price: parseFloat(product.variants[0].price) / 100, // Convert cents to dollars
        image: product.images[0]?.src || '',
        category: 'merchandise',
        in_stock: product.visible,
        printify_product_id: product.id,
        printify_data: productDetails,
        updated_at: new Date().toISOString()
      };

      if (data) {
        // Update existing product
        await supabase
          .from('products_cogli234')
          .update(productData)
          .eq('id', data.id);
      } else {
        // Insert new product
        await supabase
          .from('products_cogli234')
          .insert({
            ...productData,
            created_at: new Date().toISOString()
          });
      }
    }

    return { success: true, count: products.length };
  } catch (error) {
    console.error('Error syncing Printify products:', error);
    throw error;
  }
};