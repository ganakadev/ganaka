import axios, { AxiosError } from "axios";
import { logger } from "./logger";

export interface ApiClientConfig {
  developerToken: string;
  apiDomain: string;
}

export class ApiClient {
  private developerToken: string;
  private apiDomain: string;

  constructor({ developerToken, apiDomain }: ApiClientConfig) {
    this.developerToken = developerToken;
    this.apiDomain = apiDomain;
  }

  private getHeaders() {
    return {
      Authorization: `Bearer ${this.developerToken}`,
      "Content-Type": "application/json",
    };
  }

  async get<T>(path: string, params?: Record<string, any>): Promise<T> {
    try {
      const response = await axios.get<T>(`${this.apiDomain}${path}`, {
        params,
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        logger.error(axiosError.response?.data, `API GET error for ${path}: ${axiosError.message}`);
        throw new Error(
          axiosError.response?.data?.message || axiosError.message || "API request failed"
        );
      }
      logger.error(error, `Unexpected error in API GET ${path}`);
      throw error;
    }
  }

  async post<T>(path: string, data?: any): Promise<T> {
    try {
      const response = await axios.post<T>(`${this.apiDomain}${path}`, data, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        logger.error(
          axiosError.response?.data,
          `API POST error for ${path}: ${axiosError.message}`
        );
        throw new Error(
          axiosError.response?.data?.message || axiosError.message || "API request failed"
        );
      }
      logger.error(error, `Unexpected error in API POST ${path}`);
      throw error;
    }
  }

  async patch<T>(path: string, data?: any): Promise<T> {
    try {
      const response = await axios.patch<T>(`${this.apiDomain}${path}`, data, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        logger.error(
          axiosError.response?.data,
          `API PATCH error for ${path}: ${axiosError.message}`
        );
        throw new Error(
          axiosError.response?.data?.message || axiosError.message || "API request failed"
        );
      }
      logger.error(error, `Unexpected error in API PATCH ${path}`);
      throw error;
    }
  }

  async delete<T>(path: string): Promise<T> {
    try {
      const response = await axios.delete<T>(`${this.apiDomain}${path}`, {
        headers: this.getHeaders(),
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<{ message?: string }>;
        logger.error(
          axiosError.response?.data,
          `API DELETE error for ${path}: ${axiosError.message}`
        );
        throw new Error(
          axiosError.response?.data?.message || axiosError.message || "API request failed"
        );
      }
      logger.error(error, `Unexpected error in API DELETE ${path}`);
      throw error;
    }
  }
}
