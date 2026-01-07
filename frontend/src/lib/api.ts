import axios from 'axios';
import type { Navigation, Category, Product, ProductsResponse, SearchResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const navigationApi = {
  getAll: async (refresh = false): Promise<Navigation[]> => {
    const response = await api.get('/api/navigation', { params: { refresh } });
    return response.data;
  },
  
  getById: async (id: string): Promise<Navigation> => {
    const response = await api.get(`/api/navigation/${id}`);
    return response.data;
  },
  
  getBySlug: async (slug: string): Promise<Navigation> => {
    const response = await api.get(`/api/navigation/slug/${slug}`);
    return response.data;
  },
};

export const categoryApi = {
  getByNavigationId: async (navigationId: string, refresh = false): Promise<Category[]> => {
    const response = await api.get(`/api/categories/navigation/${navigationId}`, {
      params: { refresh },
    });
    return response.data;
  },
  
  getById: async (id: string): Promise<Category> => {
    const response = await api.get(`/api/categories/${id}`);
    return response.data;
  },
  
  getBySlug: async (slug: string): Promise<Category> => {
    const response = await api.get(`/api/categories/slug/${slug}`);
    return response.data;
  },
};

export const productApi = {
  getByCategoryId: async (
    categoryId: string,
    page = 1,
    limit = 24,
    refresh = false,
  ): Promise<ProductsResponse> => {
    const response = await api.get(`/api/products/category/${categoryId}`, {
      params: { page, limit, refresh },
    });
    return response.data;
  },
  
  getById: async (id: string, refresh = false): Promise<Product> => {
    const response = await api.get(`/api/products/${id}`, { params: { refresh } });
    return response.data;
  },
  
  search: async (query: string, page = 1, limit = 24): Promise<SearchResponse> => {
    const response = await api.get('/api/products/search', {
      params: { q: query, page, limit },
    });
    return response.data;
  },
  
  getRecommended: async (id: string, limit = 6): Promise<Product[]> => {
    const response = await api.get(`/api/products/${id}/recommended`, { params: { limit } });
    return response.data;
  },
};

export const historyApi = {
  create: async (data: {
    session_id: string;
    user_id?: string;
    path_json: Record<string, any>;
    page_title?: string;
    page_url?: string;
  }) => {
    const response = await api.post('/api/history', data);
    return response.data;
  },
  
  getBySessionId: async (sessionId: string, limit = 50) => {
    const response = await api.get(`/api/history/session/${sessionId}`, { params: { limit } });
    return response.data;
  },
  
  clearBySessionId: async (sessionId: string) => {
    const response = await api.delete(`/api/history/session/${sessionId}`);
    return response.data;
  },
};

export default api;