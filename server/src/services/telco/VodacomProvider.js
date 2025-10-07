const TelcoProvider = require('./TelcoProvider');

/**
 * Vodacom telco provider implementation
 * Mock implementation for demonstration
 */
class VodacomProvider extends TelcoProvider {
  constructor(config) {
    super(config);
    this.providerName = 'Vodacom';
  }

  async charge(msisdn, amount, serviceId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Mock validation: Vodacom numbers start with 2782 or 2784
    //   if (!msisdn.startsWith('2782') && !msisdn.startsWith('2784')) {
    //     return {
    //       success: false,
    //       error: 'Invalid Vodacom number'
    //     };
    //   }

      // Mock charge logic
      const transactionId = `vodacom_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`[Vodacom] Charged R${amount} to ${msisdn} for service ${serviceId}. Transaction: ${transactionId}`);
      
      return {
        success: true,
        transactionId
      };
    } catch (error) {
      console.error('[Vodacom] Charge error:', error);
      return {
        success: false,
        error: 'Charge failed'
      };
    }
  }

  async refund(msisdn, amount, transactionId) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));

      const refundId = `refund_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      console.log(`[Vodacom] Refunded R${amount} to ${msisdn}. Original transaction: ${transactionId}, Refund: ${refundId}`);
      
      return {
        success: true,
        refundId
      };
    } catch (error) {
      console.error('[Vodacom] Refund error:', error);
      return {
        success: false,
        error: 'Refund failed'
      };
    }
  }

  async checkBalance(msisdn) {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 100));

      // Mock balance (random between 0-1000)
      const balance = Math.floor(Math.random() * 1000);
      
      console.log(`[Vodacom] Balance for ${msisdn}: R${balance}`);
      
      return {
        success: true,
        balance
      };
    } catch (error) {
      console.error('[Vodacom] Balance check error:', error);
      return {
        success: false,
        error: 'Balance check failed'
      };
    }
  }
}

module.exports = VodacomProvider;