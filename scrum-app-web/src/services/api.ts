import axios, { AxiosInstance, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';

class ApiService {
  private api: AxiosInstance;
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
    
    this.api = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Interceptor para adicionar token de autenticação
    this.api.interceptors.request.use(
      (config) => {
        const token = Cookies.get('auth-token');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Interceptor para tratamento de respostas
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          // Token expirado ou inválido
          Cookies.remove('auth-token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.get(url);
    return response.data;
  }

  async post<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await this.api.post(url, data);
    return response.data;
  }

  async put<T>(url: string, data?: unknown): Promise<T> {
    const response: AxiosResponse<T> = await this.api.put(url, data);
    return response.data;
  }

  async delete<T>(url: string): Promise<T> {
    const response: AxiosResponse<T> = await this.api.delete(url);
    return response.data;
  }
}

export const apiService = new ApiService();
