// API Service for Backend Communication
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface ApiError {
  message: string;
  statusCode: number;
  details?: any;
}

class ApiService {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    // Backend URL - can be configured via environment variables
    this.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
    
    // Load token from localStorage if available
    this.token = localStorage.getItem('nivaran_auth_token');
  }

  // Set authentication token
  setAuthToken(token: string): void {
    this.token = token;
    localStorage.setItem('nivaran_auth_token', token);
  }

  // Clear authentication token
  clearAuthToken(): void {
    this.token = null;
    localStorage.removeItem('nivaran_auth_token');
  }

  // Get default headers
  private getHeaders(): HeadersInit {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic API request method
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${this.baseURL}${endpoint}`;
      const config: RequestInit = {
        headers: this.getHeaders(),
        ...options,
      };

      console.log(`🌐 API Request: ${options.method || 'GET'} ${url}`);

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'API request failed',
          statusCode: response.status,
          details: data
        } as ApiError;
      }

      console.log(`✅ API Success: ${endpoint}`, data);
      return {
        success: true,
        data: data.data || data,
        message: data.message,
        statusCode: response.status
      };

    } catch (error: any) {
      console.error(`❌ API Error: ${endpoint}`, error);
      
      if (error.statusCode === 401) {
        // Unauthorized - clear token and redirect to login
        this.clearAuthToken();
        window.location.href = '/';
      }

      return {
        success: false,
        error: error.message || 'Network error occurred',
        statusCode: error.statusCode || 500
      };
    }
  }

  // GET request
  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  // POST request
  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // PUT request
  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // DELETE request
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  // PATCH request
  async patch<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  // File upload
  async uploadFile<T>(endpoint: string, file: File, additionalData?: any): Promise<ApiResponse<T>> {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      if (additionalData) {
        Object.keys(additionalData).forEach(key => {
          formData.append(key, additionalData[key]);
        });
      }

      const headers: HeadersInit = {};
      if (this.token) {
        headers['Authorization'] = `Bearer ${this.token}`;
      }

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'POST',
        headers,
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw {
          message: data.message || 'File upload failed',
          statusCode: response.status,
          details: data
        } as ApiError;
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
        statusCode: response.status
      };

    } catch (error: any) {
      console.error(`❌ File Upload Error: ${endpoint}`, error);
      return {
        success: false,
        error: error.message || 'File upload failed',
        statusCode: error.statusCode || 500
      };
    }
  }

  // Health check
  async healthCheck(): Promise<boolean> {
    try {
      const response = await this.get('/health');
      return response.success;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  }

  // Get backend status
  async getBackendStatus(): Promise<{
    isConnected: boolean;
    version?: string;
    uptime?: string;
    environment?: string;
  }> {
    try {
      const response = await this.get('/status');
      if (response.success && response.data) {
        const data = response.data as any;
        return {
          isConnected: true,
          version: data.version,
          uptime: data.uptime,
          environment: data.environment
        };
      }
    } catch (error) {
      console.error('Failed to get backend status:', error);
    }

    return { isConnected: false };
  }
}

// Create singleton instance
export const apiService = new ApiService();
