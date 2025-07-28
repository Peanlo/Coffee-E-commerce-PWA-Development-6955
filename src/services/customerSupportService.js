import supabase from '../lib/supabase';

// Save customer support conversation
export const saveSupportConversation = async (userId, conversation, category = 'general') => {
  try {
    const { data, error } = await supabase
      .from('support_conversations')
      .insert([
        {
          user_id: userId,
          conversation_data: conversation,
          category,
          status: 'active',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving support conversation:', error);
    throw error;
  }
};

// Get user's support conversations
export const getUserSupportConversations = async (userId) => {
  try {
    const { data, error } = await supabase
      .from('support_conversations')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting support conversations:', error);
    throw error;
  }
};

// Create support ticket
export const createSupportTicket = async (ticketData) => {
  try {
    const { data, error } = await supabase
      .from('support_tickets')
      .insert([
        {
          ...ticketData,
          status: 'open',
          created_at: new Date().toISOString()
        }
      ])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error creating support ticket:', error);
    throw error;
  }
};

// Get support ticket by ID
export const getSupportTicket = async (ticketId, userId = null) => {
  try {
    let query = supabase
      .from('support_tickets')
      .select('*')
      .eq('id', ticketId);

    // If userId is provided, restrict to that user's tickets for security
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error getting support ticket:', error);
    throw error;
  }
};

// Update support ticket status
export const updateSupportTicketStatus = async (ticketId, status, userId = null) => {
  try {
    let query = supabase
      .from('support_tickets')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', ticketId);

    // If userId is provided, restrict to that user's tickets for security
    if (userId) {
      query = query.eq('user_id', userId);
    }

    const { data, error } = await query.select().single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating support ticket:', error);
    throw error;
  }
};

// Get all support tickets (admin only)
export const getAllSupportTickets = async (filters = {}) => {
  try {
    let query = supabase
      .from('support_tickets')
      .select(`
        *,
        profiles:user_id (
          name,
          email
        )
      `);

    // Apply status filter
    if (filters.status) {
      query = query.eq('status', filters.status);
    }

    // Apply category filter
    if (filters.category) {
      query = query.eq('category', filters.category);
    }

    // Apply date range filter
    if (filters.startDate && filters.endDate) {
      query = query
        .gte('created_at', filters.startDate)
        .lte('created_at', filters.endDate);
    }

    // Apply sorting
    if (filters.sortBy) {
      const [field, direction] = filters.sortBy.split('-');
      query = query.order(field, { ascending: direction === 'asc' });
    } else {
      // Default sorting by created_at desc
      query = query.order('created_at', { ascending: false });
    }

    // Apply pagination
    if (filters.page && filters.limit) {
      const from = (filters.page - 1) * filters.limit;
      const to = from + filters.limit - 1;
      query = query.range(from, to);
    }

    const { data, error, count } = await query;
    if (error) throw error;

    return { tickets: data, count };
  } catch (error) {
    console.error('Error getting all support tickets:', error);
    throw error;
  }
};

// Get support statistics (admin only)
export const getSupportStatistics = async (period = 'month') => {
  try {
    let timeRange;
    const now = new Date();

    // Calculate date range based on period
    switch (period) {
      case 'week':
        const weekAgo = new Date();
        weekAgo.setDate(now.getDate() - 7);
        timeRange = weekAgo.toISOString();
        break;
      case 'month':
        const monthAgo = new Date();
        monthAgo.setMonth(now.getMonth() - 1);
        timeRange = monthAgo.toISOString();
        break;
      case 'year':
        const yearAgo = new Date();
        yearAgo.setFullYear(now.getFullYear() - 1);
        timeRange = yearAgo.toISOString();
        break;
      default:
        const defaultAgo = new Date();
        defaultAgo.setMonth(now.getMonth() - 1);
        timeRange = defaultAgo.toISOString();
    }

    // Get tickets in time range
    const { data: tickets, error: ticketsError } = await supabase
      .from('support_tickets')
      .select('*')
      .gte('created_at', timeRange);

    if (ticketsError) throw ticketsError;

    // Calculate statistics
    const totalTickets = tickets.length;
    
    // Count tickets by status
    const ticketsByStatus = tickets.reduce((acc, ticket) => {
      acc[ticket.status] = (acc[ticket.status] || 0) + 1;
      return acc;
    }, {});

    // Count tickets by category
    const ticketsByCategory = tickets.reduce((acc, ticket) => {
      acc[ticket.category] = (acc[ticket.category] || 0) + 1;
      return acc;
    }, {});

    return {
      totalTickets,
      ticketsByStatus,
      ticketsByCategory
    };
  } catch (error) {
    console.error('Error getting support statistics:', error);
    throw error;
  }
};