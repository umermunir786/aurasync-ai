import { Purchases, LOG_LEVEL } from '@revenuecat/purchases-capacitor';

export const SubscriptionService = {
  async init() {
    await Purchases.setLogLevel({ level: LOG_LEVEL.DEBUG });
    await Purchases.configure({
      apiKey: 'goog_YOUR_API_KEY', // Placeholder
      // iosApiKey: 'appl_YOUR_API_KEY', // Placeholder
    });
  },

  async getOfferings() {
    try {
      const offerings = await Purchases.getOfferings();
      return offerings;
    } catch (error) {
      console.error('Error fetching offerings:', error);
      throw error;
    }
  },

  async purchasePackage(pkg: any) {
    try {
      const { customerInfo } = await Purchases.purchasePackage({ aPackage: pkg });
      return customerInfo;
    } catch (error: any) {
      if (!error.userCancelled) {
        console.error('Purchase error:', error);
      }
      throw error;
    }
  },

  async getCustomerInfo() {
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      return customerInfo;
    } catch (error) {
      console.error('Error getting customer info:', error);
      throw error;
    }
  }
};
