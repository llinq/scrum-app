/* eslint-disable */
import { Injectable } from '@nestjs/common';

@Injectable()
export class HttpService {
  async get<T>(url: string, config?: any): Promise<T> {
    // Implementar chamada HTTP GET
    throw new Error('HTTP service not implemented');
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    // Implementar chamada HTTP POST
    throw new Error('HTTP service not implemented');
  }

  async put<T>(url: string, data?: any, config?: any): Promise<T> {
    // Implementar chamada HTTP PUT
    throw new Error('HTTP service not implemented');
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    // Implementar chamada HTTP DELETE
    throw new Error('HTTP service not implemented');
  }
} 