import { ApiService } from "../api/apiService";
import config from "../../constants/env";

class SubscriptionService extends ApiService {
  constructor() {
    // basePath is empty; we will pass absolute endpoints beginning with '/'
    super("");
  }

  // GET /api/subscriptions → baseURL already includes '/api'
  async getSubscriptions() {
    const endpoint = "/subscriptions";
    console.log("🔍 [Subscriptions] GET endpoint:", endpoint);
    console.log(
      "🌐 [Subscriptions] Full URL:",
      `${config.api.baseURL}${endpoint}`
    );
    return this.get(endpoint);
  }

  // GET /api/subscriptions/{id}
  async getSubscriptionById(id) {
    if (!id) throw new Error("subscription id is required");
    const endpoint = `/subscriptions/${id}`;
    console.log("🔍 [Subscriptions] GET by id endpoint:", endpoint);
    console.log(
      "🌐 [Subscriptions] Full URL:",
      `${config.api.baseURL}${endpoint}`
    );
    return this.get(endpoint);
  }

  // POST /api/subscriptions/{packageId}/purchase
  async purchaseSubscription(packageId) {
    if (!packageId) throw new Error("packageId is required");
    const endpoint = `/subscriptions/${packageId}/purchase`;
    console.log("🔍 [Subscriptions] POST purchase endpoint:", endpoint);
    console.log(
      "🌐 [Subscriptions] Full URL:",
      `${config.api.baseURL}${endpoint}`
    );
    try {
      const res = await this.post(endpoint);
      console.log("📥 [Subscriptions] Purchase response:", res);
      return res;
    } catch (error) {
      console.error("❌ [Subscriptions] Purchase error:", error?.message);
      console.error("❌ [Subscriptions] Status:", error?.response?.status);
      console.error("❌ [Subscriptions] Data:", error?.response?.data);
      throw error;
    }
  }

  // GET /api/subscriptions/current - get current user's active subscription
  async getCurrentSubscription() {
    const endpoint = "/subscriptions/current";
    console.log("🔍 [Subscriptions] GET current endpoint:", endpoint);
    console.log(
      "🌐 [Subscriptions] Full URL:",
      `${config.api.baseURL}${endpoint}`
    );
    return this.get(endpoint);
  }

  // DELETE /api/subscriptions/{packageId} - cancel current subscription
  async cancelSubscription(packageId) {
    if (!packageId) throw new Error("packageId is required");
    const endpoint = `/subscriptions/${packageId}`;
    console.log("🔍 [Subscriptions] DELETE cancel endpoint:", endpoint);
    console.log(
      "🌐 [Subscriptions] Full URL:",
      `${config.api.baseURL}${endpoint}`
    );
    return this.delete(endpoint);
  }
}

const subscriptionService = new SubscriptionService();
export default subscriptionService;
