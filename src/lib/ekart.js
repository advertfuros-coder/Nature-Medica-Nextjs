// Ekart Logistics API Integration Utility
import axios from "axios";

const EKART_BASE_URL = "https://app.elite.ekartlogistics.in";

class EkartAPI {
  constructor() {
    this.clientId = process.env.EKART_CLIENT_ID;
    this.username = process.env.EKART_USERNAME;
    this.password = process.env.EKART_PASSWORD;
    this.accessToken = null;
    this.tokenExpiry = null;
  }

  /**
   * Get access token for Ekart API
   * Token is valid for 24 hours and cached
   */
  async getAccessToken() {
    // Return cached token if still valid
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    try {
      const response = await axios.post(
        `${EKART_BASE_URL}/integrations/v2/auth/token/${this.clientId}`,
        {
          username: this.username,
          password: this.password,
        }
      );

      this.accessToken = response.data.access_token;
      // Store expiry time (expires_in is in seconds)
      this.tokenExpiry = Date.now() + response.data.expires_in * 1000;

      return this.accessToken;
    } catch (error) {
      console.error(
        "❌ Ekart authentication error:",
        error.response?.data || error.message
      );
      throw new Error("Failed to authenticate with Ekart");
    }
  }

  /**
   * Get authorization headers
   */
  async getHeaders() {
    const token = await this.getAccessToken();
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  /**
   * Create a new shipment
   * @param {Object} shipmentData - Shipment details
   * @returns {Promise<Object>} - Shipment response with tracking_id
   */
  async createShipment(shipmentData) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.put(
        `${EKART_BASE_URL}/api/v1/package/create`,
        shipmentData,
        { headers }
      );

      console.log("✅ Ekart shipment created:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart create shipment error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Cancel a shipment
   * @param {string} trackingId - Ekart tracking ID
   * @returns {Promise<Object>} - Cancellation response
   */
  async cancelShipment(trackingId) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.delete(
        `${EKART_BASE_URL}/api/v1/package/cancel?tracking_id=${trackingId}`,
        { headers }
      );

      console.log("✅ Ekart shipment cancelled:", response.data);
      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart cancel shipment error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Track a shipment (Open API - no auth required)
   * @param {string} trackingId - Ekart tracking ID
   * @returns {Promise<Object>} - Tracking information
   */
  async trackShipment(trackingId) {
    try {
      const response = await axios.get(
        `${EKART_BASE_URL}/api/v1/track/${trackingId}`
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart track shipment error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Download shipping label (PDF)
   * @param {Array<string>} trackingIds - Array of tracking IDs (max 100)
   * @param {boolean} jsonOnly - Return JSON data only (no PDF)
   * @returns {Promise<Buffer|Object>} - PDF buffer or JSON data
   */
  async downloadLabel(trackingIds, jsonOnly = false) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${EKART_BASE_URL}/api/v1/package/label?json_only=${jsonOnly}`,
        { ids: trackingIds },
        {
          headers,
          responseType: jsonOnly ? "json" : "arraybuffer",
        }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart download label error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Download manifest (PDF)
   * @param {Array<string>} trackingIds - Array of tracking IDs (max 100)
   * @returns {Promise<Object>} - Manifest URLs
   */
  async downloadManifest(trackingIds) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${EKART_BASE_URL}/data/v2/generate/manifest`,
        { ids: trackingIds },
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart download manifest error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Check serviceability for a pincode
   * @param {number} pincode - Indian pincode
   * @returns {Promise<Object>} - Serviceability information
   */
  async checkServiceability(pincode) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(
        `${EKART_BASE_URL}/api/v2/serviceability/${pincode}`,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart serviceability check error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Get shipping rate estimate
   * @param {Object} estimateData - Estimate request data
   * @returns {Promise<Object>} - Pricing estimates
   */
  async getEstimate(estimateData) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${EKART_BASE_URL}/data/pricing/estimate`,
        estimateData,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart estimate error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Add/register a pickup/return address
   * @param {Object} addressData - Address details
   * @returns {Promise<Object>} - Address response
   */
  async addAddress(addressData) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${EKART_BASE_URL}/api/v2/address`,
        addressData,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart add address error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Get all registered addresses
   * @returns {Promise<Array>} - List of addresses
   */
  async getAddresses() {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${EKART_BASE_URL}/api/v2/addresses`, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart get addresses error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Add a webhook for tracking updates
   * @param {Object} webhookData - Webhook configuration
   * @returns {Promise<Object>} - Webhook response
   */
  async addWebhook(webhookData) {
    try {
      const headers = await this.getHeaders();
      const response = await axios.post(
        `${EKART_BASE_URL}/api/v2/webhook`,
        webhookData,
        { headers }
      );

      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart add webhook error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }

  /**
   * Get all webhooks
   * @returns {Promise<Array>} - List of webhooks
   */
  async getWebhooks() {
    try {
      const headers = await this.getHeaders();
      const response = await axios.get(`${EKART_BASE_URL}/api/v2/webhook`, {
        headers,
      });

      return response.data;
    } catch (error) {
      console.error(
        "❌ Ekart get webhooks error:",
        error.response?.data || error.message
      );
      throw error;
    }
  }
}

// Export singleton instance with a name to avoid ESLint warning
const ekartAPI = new EkartAPI();
export default ekartAPI;
