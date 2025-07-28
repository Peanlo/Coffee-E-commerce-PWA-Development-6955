export const abandonedCartTemplate = {
  subject: 'Complete Your Purchase at Cogli Caffe',
  getHtml: (data: any) => `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h1 style="color: #8B4513; font-size: 28px; margin-bottom: 10px;">Don't Miss Out!</h1>
        <p style="color: #666; font-size: 16px;">Your cart is waiting for you</p>
      </div>

      <div style="background: linear-gradient(135deg, #8B4513 0%, #D2691E 100%); color: white; padding: 30px; border-radius: 10px; text-align: center; margin-bottom: 30px;">
        <h2 style="margin: 0 0 15px 0; font-size: 24px;">Hello ${data.customerName}!</h2>
        <p style="margin: 0; font-size: 16px; opacity: 0.9;">
          We noticed you left some items in your cart. Would you like to complete your purchase?
        </p>
      </div>

      <div style="text-align: center; margin-bottom: 30px;">
        <a href="${data.recoveryUrl}" 
           style="background: #8B4513; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; font-weight: bold; display: inline-block;">
          Complete Your Purchase
        </a>
      </div>

      <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center; color: #666; font-size: 14px;">
        <p>This cart will be saved for a limited time. Don't miss out on your selected items!</p>
        <p>© 2024 Cogli Caffe. All rights reserved.</p>
      </div>
    </div>
  `
};