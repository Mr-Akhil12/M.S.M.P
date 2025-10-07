const VodacomProvider = require('../services/telco/VodacomProvider');
const MTNProvider = require('../services/telco/MTNProvider');

/**
 * Telco provider API configurations
 * Uses mock values for development/assessment
 */
const telcoConfigs = {
  vodacom: {
    apiKey: process.env.VODACOM_API_KEY || 'mock_vodacom_key',
    apiUrl: process.env.VODACOM_API_URL || 'https://api.vodacom.co.za',
    timeout: 5000
  },
  mtn: {
    apiKey: process.env.MTN_API_KEY || 'mock_mtn_key',
    apiUrl: process.env.MTN_API_URL || 'https://api.mtn.co.za',
    timeout: 5000
  }
};

/**
 * Factory function to create telco provider instance based on configuration
 * @param {string} providerName - Provider name ('vodacom' or 'mtn')
 * @returns {TelcoProvider} Configured provider instance
 * @throws {Error} If provider name is unsupported
 */
function createTelcoProvider(providerName = process.env.TELCO_PROVIDER || 'vodacom') {
  const normalizedName = providerName.toLowerCase();
  
  switch (normalizedName) {
    case 'vodacom':
      return new VodacomProvider(telcoConfigs.vodacom);
    case 'mtn':
      return new MTNProvider(telcoConfigs.mtn);
    default:
      throw new Error(`Unsupported telco provider: ${providerName}. Supported: vodacom, mtn`);
  }
}

/**
 * Detect telco provider from South African mobile number prefix
 * @param {string} msisdn - Mobile number in format 27XXXXXXXXX
 * @returns {string} Provider name ('vodacom' or 'mtn')
 */
function getProviderFromMSISDN(msisdn) {
  // Vodacom prefixes: 082, 071, 072, 073, 074, 076, 079
  if (msisdn.match(/^27(82|71|72|73|74|76|79)/)) {
    return 'vodacom';
  }
  
  // MTN prefixes: 083, 084
  if (msisdn.match(/^27(83|84)/)) {
    return 'mtn';
  }
  
  // Default to configured provider for Telkom, Cell C, etc.
  return process.env.TELCO_PROVIDER || 'vodacom';
}

module.exports = {
  createTelcoProvider,
  getProviderFromMSISDN,
  telcoConfigs
};