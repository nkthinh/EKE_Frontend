import { apiHelper } from "./api";

// Base API service class
class ApiService {
  constructor(basePath = "") {
    this.basePath = basePath;
  }

  // GET request
  async get(endpoint = "", params = {}) {
    const url = `${this.basePath}${endpoint}`;
    const response = await apiHelper.get(url, { params });
    return response.data;
  }

  // POST request
  async post(endpoint = "", data = {}) {
    const url = `${this.basePath}${endpoint}`;
    const response = await apiHelper.post(url, data);
    return response.data;
  }

  // PUT request
  async put(endpoint = "", data = {}) {
    const url = `${this.basePath}${endpoint}`;
    const response = await apiHelper.put(url, data);
    return response.data;
  }

  // DELETE request
  async delete(endpoint = "") {
    const url = `${this.basePath}${endpoint}`;
    const response = await apiHelper.delete(url);
    return response.data;
  }

  // PATCH request
  async patch(endpoint = "", data = {}) {
    const url = `${this.basePath}${endpoint}`;
    const response = await apiHelper.patch(url, data);
    return response.data;
  }

  // Upload file
  async upload(endpoint = "", formData) {
    const url = `${this.basePath}${endpoint}`;
    const response = await apiHelper.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  }
}

export { ApiService };
export default ApiService;
