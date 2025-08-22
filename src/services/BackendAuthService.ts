// Backend Authentication Service
import { apiService, ApiResponse } from './ApiService';

export interface LoginRequest {
  email?: string;
  phone?: string;
  password: string;
  userType: 'user' | 'mentor' | 'doctor';
}

export interface RegisterRequest {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  userType: 'user' | 'mentor' | 'doctor';
  age?: number;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export interface AuthResponse {
  user: {
    id: string;
    name: string;
    email?: string;
    phone?: string;
    userType: 'user' | 'mentor' | 'doctor';
    riskLevel?: 'safe' | 'medium' | 'high';
    isVerified: boolean;
    createdAt: string;
    lastLogin: string;
  };
  token: string;
  refreshToken: string;
  expiresIn: number;
}

export interface PasswordResetRequest {
  email?: string;
  phone?: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

class BackendAuthService {
  // Login user
  async login(credentials: LoginRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>('/auth/login', credentials);
    
    if (response.success && response.data?.token) {
      // Store token in API service
      apiService.setAuthToken(response.data.token);
      
      // Store user data in localStorage
      localStorage.setItem('nivaran_user', JSON.stringify(response.data.user));
      localStorage.setItem('nivaran_refresh_token', response.data.refreshToken);
      
      console.log('✅ User logged in successfully:', response.data.user);
    }
    
    return response;
  }

  // Register new user
  async register(userData: RegisterRequest): Promise<ApiResponse<AuthResponse>> {
    const response = await apiService.post<AuthResponse>('/auth/register', userData);
    
    if (response.success && response.data?.token) {
      // Store token in API service
      apiService.setAuthToken(response.data.token);
      
      // Store user data in localStorage
      localStorage.setItem('nivaran_user', JSON.stringify(response.data.user));
      localStorage.setItem('nivaran_refresh_token', response.data.refreshToken);
      
      console.log('✅ User registered successfully:', response.data.user);
    }
    
    return response;
  }

  // Logout user
  async logout(): Promise<ApiResponse<void>> {
    const response = await apiService.post<void>('/auth/logout');
    
    // Clear local storage regardless of API response
    apiService.clearAuthToken();
    localStorage.removeItem('nivaran_user');
    localStorage.removeItem('nivaran_refresh_token');
    
    console.log('✅ User logged out');
    return response;
  }

  // Refresh authentication token
  async refreshToken(): Promise<ApiResponse<{ token: string; expiresIn: number }>> {
    const refreshToken = localStorage.getItem('nivaran_refresh_token');
    
    if (!refreshToken) {
      return {
        success: false,
        error: 'No refresh token available'
      };
    }

    const response = await apiService.post<{ token: string; expiresIn: number }>('/auth/refresh', {
      refreshToken
    });

    if (response.success && response.data?.token) {
      apiService.setAuthToken(response.data.token);
      console.log('✅ Token refreshed successfully');
    }

    return response;
  }

  // Get current user profile
  async getCurrentUser(): Promise<ApiResponse<AuthResponse['user']>> {
    return await apiService.get<AuthResponse['user']>('/auth/me');
  }

  // Update user profile
  async updateProfile(updates: Partial<AuthResponse['user']>): Promise<ApiResponse<AuthResponse['user']>> {
    return await apiService.put<AuthResponse['user']>('/auth/profile', updates);
  }

  // Request password reset
  async requestPasswordReset(request: PasswordResetRequest): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/auth/forgot-password', request);
  }

  // Confirm password reset
  async confirmPasswordReset(request: PasswordResetConfirm): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/auth/reset-password', request);
  }

  // Verify email/phone
  async verifyContact(token: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/auth/verify', { token });
  }

  // Resend verification
  async resendVerification(type: 'email' | 'phone'): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/auth/resend-verification', { type });
  }

  // Check if user is authenticated (from localStorage)
  isAuthenticated(): boolean {
    const token = localStorage.getItem('nivaran_auth_token');
    const user = localStorage.getItem('nivaran_user');
    return !!(token && user);
  }

  // Get stored user data
  getStoredUser(): AuthResponse['user'] | null {
    const userData = localStorage.getItem('nivaran_user');
    if (userData) {
      try {
        return JSON.parse(userData);
      } catch (error) {
        console.error('Failed to parse stored user data:', error);
        return null;
      }
    }
    return null;
  }

  // Change password
  async changePassword(currentPassword: string, newPassword: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.post<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword
    });
  }

  // Delete account
  async deleteAccount(password: string): Promise<ApiResponse<{ message: string }>> {
    return await apiService.delete<{ message: string }>('/auth/account');
  }
}

export const backendAuthService = new BackendAuthService();
