const axios = require('axios');

/**
 * EasySendSMS Service
 * Sends OTP via SMS using EasySendSMS REST API v1
 */
class SMSService {
  constructor() {
    this.apiKey = process.env.EASYSENDSMS_API_KEY;
    this.senderId = process.env.EASYSENDSMS_SENDER_ID || 'MSMP';
    this.baseUrl = 'https://restapi.easysendsms.app/v1/rest/sms/send';
    this.enabled = process.env.SMS_ENABLED === 'true';
  }

  async sendOTP(msisdn, otp) {
    // Test mode - OTP logged to terminal only
    if (!this.enabled) {
      console.log('\n========================================');
      console.log('📱 SMS TEST MODE - OTP Generated');
      console.log('========================================');
      console.log(`Phone: ${msisdn}`);
      console.log(`OTP Code: ${otp}`);
      console.log(`Expires: 5 minutes`);
      console.log('========================================\n');
      
      return {
        success: true,
        messageId: 'test_mode_' + Date.now(),
        mock: true
      };
    }

    // Production mode - Real SMS via EasySendSMS
    try {
      if (!this.apiKey) {
        throw new Error('SMS API key not configured');
      }

      const cleanMsisdn = msisdn.replace(/^\+/, '').replace(/^00/, '');
      const message = `Your MSMP verification code is: ${otp}. Valid for 5 minutes. Do not share this code.`;

      const payload = {
        from: this.senderId,
        to: cleanMsisdn,
        text: message,
        type: "0"
      };

      const response = await axios.post(this.baseUrl, payload, {
        headers: {
          'apikey': this.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 15000
      });

      if (response.data.status === 'OK' && response.data.messageIds?.length > 0) {
        const messageIdString = response.data.messageIds[0];
        
        if (messageIdString.startsWith('OK:')) {
          const messageId = messageIdString.replace('OK: ', '').trim();
          console.log(`[SMS] Sent to ${msisdn} (ID: ${messageId})`);
          
          return {
            success: true,
            messageId,
            provider: 'EasySendSMS'
          };
        }
        
        if (messageIdString.startsWith('ERR:')) {
          const errorCode = messageIdString.match(/ERR:\s*(\d+)/)?.[1];
          return {
            success: false,
            error: `SMS failed with code ${errorCode}`,
            errorCode: parseInt(errorCode)
          };
        }
      }

      return {
        success: false,
        error: 'Unexpected API response'
      };

    } catch (error) {
      console.error('[SMS] Error:', error.message);
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        const errorMessages = {
          4003: 'Invalid API Key',
          4006: 'Inactive Account',
          4007: 'Demo Account Expired',
          4012: 'Invalid mobile number',
          4014: 'Invalid sender name',
          4015: 'Insufficient credits'
        };

        return {
          success: false,
          error: errorMessages[errorData.error] || errorData.description || 'SMS sending failed',
          errorCode: errorData.error
        };
      }
      
      return {
        success: false,
        error: 'SMS service unavailable'
      };
    }
  }

  async sendBulk(msisdns, message) {
    if (!this.enabled) {
      console.log('\n========================================');
      console.log('📱 SMS TEST MODE - Bulk Message');
      console.log('========================================');
      console.log(`Recipients: ${msisdns.length}`);
      console.log(`Message: ${message}`);
      console.log('========================================\n');
      
      return {
        success: true,
        results: msisdns.map(m => ({ msisdn: m, success: true, mock: true })),
        mock: true
      };
    }

    try {
      if (!this.apiKey) {
        throw new Error('SMS API key not configured');
      }

      if (msisdns.length > 30) {
        throw new Error('Maximum 30 recipients per request');
      }

      const cleanMsisdns = msisdns.map(m => m.replace(/^\+/, '').replace(/^00/, '')).join(',');

      const payload = {
        from: this.senderId,
        to: cleanMsisdns,
        text: message,
        type: "0"
      };

      const response = await axios.post(this.baseUrl, payload, {
        headers: {
          'apikey': this.apiKey,
          'Content-Type': 'application/json'
        },
        timeout: 30000
      });

      const results = response.data.messageIds.map((msgId, index) => ({
        msisdn: msisdns[index],
        success: msgId.startsWith('OK:'),
        messageId: msgId.replace(/^(OK|ERR):\s*(\d+,)?/, '').trim(),
        error: msgId.startsWith('ERR:') ? msgId : null
      }));

      return {
        success: response.data.status === 'OK',
        results
      };

    } catch (error) {
      console.error('[SMS] Bulk error:', error.message);
      return {
        success: false,
        error: error.response?.data?.description || error.message
      };
    }
  }

  async checkHealth() {
    if (!this.enabled) {
      return { 
        healthy: true, 
        configured: true, 
        mode: 'test',
        message: 'SMS test mode active - OTPs logged to terminal' 
      };
    }

    if (!this.apiKey) {
      return { 
        healthy: false, 
        configured: false, 
        error: 'API key not configured' 
      };
    }

    return { 
      healthy: true,
      configured: true,
      mode: 'production',
      provider: 'EasySendSMS'
    };
  }
}

module.exports = new SMSService();