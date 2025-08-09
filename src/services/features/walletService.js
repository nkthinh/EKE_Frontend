import { ApiService } from "../api/apiService";

class WalletService extends ApiService {
  constructor() {
    super("");
  }

  // GET /Wallet/{userId}
  async getWallet(userId) {
    if (!userId) {
      throw new Error("userId is required to fetch wallet");
    }
    const endpoint = `/Wallet/${userId}`;
    return this.get(endpoint);
  }
}

const walletService = new WalletService();
export default walletService;
