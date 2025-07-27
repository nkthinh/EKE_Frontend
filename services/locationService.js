import api from './api';

const locationService = {
  async getProvinces() {
    try {
      const response = await api.get('/Locations/provinces');
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getDistrictsByProvince(provinceId) {
    try {
      const response = await api.get(`/Locations/districts/${provinceId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default locationService;