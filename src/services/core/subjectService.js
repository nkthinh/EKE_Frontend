import { api } from "../api";

const subjectService = {
  async getAllSubjects() {
    try {
      const response = await api.get("/Subjects");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async createSubject(subjectData) {
    try {
      const response = await api.post("/Subjects", subjectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getSubjectCategories() {
    try {
      const response = await api.get("/Subjects/categories");
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getSubjectsByCategory(category) {
    try {
      const response = await api.get(`/Subjects/category/${category}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async getSubjectById(id) {
    try {
      const response = await api.get(`/Subjects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async updateSubject(id, subjectData) {
    try {
      const response = await api.put(`/Subjects/${id}`, subjectData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async deleteSubject(id) {
    try {
      const response = await api.delete(`/Subjects/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },
};

export default subjectService;
