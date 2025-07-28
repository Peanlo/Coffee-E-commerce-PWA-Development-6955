import { useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import * as emailService from '../services/emailService';

export const useEmailNotifications = () => {
  const { user } = useAuth();

  const sendOrderConfirmation = useCallback(async (order) => {
    if (!user) return;
    return await emailService.sendOrderConfirmationEmail(order, user);
  }, [user]);

  const sendShippingUpdate = useCallback(async (order, trackingInfo) => {
    if (!user) return;
    return await emailService.sendShippingUpdateEmail(order, user, trackingInfo);
  }, [user]);

  const sendWelcome = useCallback(async () => {
    if (!user) return;
    return await emailService.sendWelcomeEmail(user);
  }, [user]);

  const sendPasswordReset = useCallback(async (resetToken) => {
    if (!user) return;
    return await emailService.sendPasswordResetEmail(user, resetToken);
  }, [user]);

  const sendOrderShipped = useCallback(async (order, trackingInfo) => {
    if (!user) return;
    return await emailService.sendOrderShippedEmail(order, user, trackingInfo);
  }, [user]);

  const sendOrderDelivered = useCallback(async (order) => {
    if (!user) return;
    return await emailService.sendOrderDeliveredEmail(order, user);
  }, [user]);

  return {
    sendOrderConfirmation,
    sendShippingUpdate,
    sendWelcome,
    sendPasswordReset,
    sendOrderShipped,
    sendOrderDelivered
  };
};