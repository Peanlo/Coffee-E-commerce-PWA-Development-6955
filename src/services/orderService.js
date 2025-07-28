import { v4 as uuidv4 } from 'uuid';

// Create a new order
export const createOrder = async (orderData, items) => {
  try {
    // In a real implementation, this would save to your database
    // For this demo, we'll simulate a successful response
    const orderId = uuidv4();
    console.log('Creating order:', { ...orderData, id: orderId });
    console.log('Order items:', items);
    
    // Simulate successful order creation
    return {
      id: orderId,
      ...orderData,
      created_at: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Get user orders
export const getUserOrders = async (userId) => {
  try {
    // In a real implementation, this would fetch from your database
    // For this demo, we'll return mock data
    return [
      {
        id: uuidv4(),
        user_id: userId,
        total_amount: 124.00,
        status: 'shipped',
        created_at: new Date().toISOString(),
        order_items: [
          {
            id: uuidv4(),
            quantity: 2,
            price: 24.99,
            products: {
              id: '1',
              name: 'Premium Coffee Blend',
              image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
          },
          {
            id: uuidv4(),
            quantity: 1,
            price: 74.02,
            products: {
              id: '2',
              name: 'Coffee Mug Set',
              image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
            }
          }
        ]
      }
    ];
  } catch (error) {
    console.error('Error getting user orders:', error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (orderId, userId = null) => {
  try {
    // In a real implementation, this would fetch from your database
    // For this demo, we'll return mock data
    return {
      id: orderId,
      user_id: userId || 'user123',
      total_amount: 124.00,
      status: 'shipped',
      created_at: new Date().toISOString(),
      shipping_address: {
        firstName: 'John',
        lastName: 'Doe',
        address1: '123 Coffee St',
        address2: 'Apt 4B',
        city: 'Seattle',
        state: 'WA',
        zip: '98101',
        country: 'US'
      },
      order_items: [
        {
          id: uuidv4(),
          quantity: 2,
          price: 24.99,
          products: {
            id: '1',
            name: 'Premium Coffee Blend',
            description: 'Our signature blend of premium coffee beans',
            price: 24.99,
            image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }
        },
        {
          id: uuidv4(),
          quantity: 1,
          price: 74.02,
          products: {
            id: '2',
            name: 'Coffee Mug Set',
            description: 'Set of 4 handcrafted ceramic coffee mugs',
            price: 74.02,
            image: 'https://images.unsplash.com/photo-1572119865084-43c285814d63?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80'
          }
        }
      ],
      printify_shipping: [
        {
          carrier: 'USPS',
          tracking_number: '9400123456789012345678',
          tracking_url: 'https://tools.usps.com/go/TrackConfirmAction?tLabels=9400123456789012345678'
        }
      ]
    };
  } catch (error) {
    console.error('Error getting order:', error);
    throw error;
  }
};