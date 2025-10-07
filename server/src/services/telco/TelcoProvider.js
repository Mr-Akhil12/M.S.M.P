/**
 * Abstract base class for telco providers
 * Defines the interface for billing operations
 */
class TelcoProvider {
  constructor(config) {
    this.config = config;
  }

  /**
   * Charge a user's account
   * @param {string} msisdn - Mobile number
   * @param {number} amount - Amount to charge
   * @param {string} serviceId - Service identifier
   * @returns {Promise<{success: boolean, transactionId?: string, error?: string}>}
   */
  async charge(msisdn, amount, serviceId) {
    throw new Error('charge() method must be implemented by subclass');
  }

  /**
   * Refund a user's account
   * @param {string} msisdn - Mobile number
   * @param {number} amount - Amount to refund
   * @param {string} transactionId - Original transaction ID
   * @returns {Promise<{success: boolean, refundId?: string, error?: string}>}
   */
  async refund(msisdn, amount, transactionId) {
    throw new Error('refund() method must be implemented by subclass');
  }

  /**
   * Check account balance
   * @param {string} msisdn - Mobile number
   * @returns {Promise<{success: boolean, balance?: number, error?: string}>}
   */
  async checkBalance(msisdn) {
    throw new Error('checkBalance() method must be implemented by subclass');
  }
}

module.exports = TelcoProvider;