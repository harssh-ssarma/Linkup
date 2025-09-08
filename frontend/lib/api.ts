const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

interface ApiResponse<T = any> {
  data?: T
  error?: string
  status: number
}

class ApiService {
  private baseURL: string
  private token: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    // Get token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token')
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    }

    // Add auth token if available
    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      })

      const data = await response.json()

      return {
        data: response.ok ? data : undefined,
        error: response.ok ? undefined : data.error || 'Request failed',
        status: response.status,
      }
    } catch (error) {
      console.error('API Request Error:', error)
      return {
        error: 'Network error. Please check if the backend server is running.',
        status: 0,
      }
    }
  }

  // Authentication methods
  async sendOTP(phoneNumber: string, countryCode: string) {
    return this.request('/api/auth/send-otp/', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        country_code: countryCode,
      }),
    })
  }

  async verifyOTP(phoneNumber: string, otpCode: string) {
    const response = await this.request('/api/auth/verify-otp/', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        otp_code: otpCode,
      }),
    })

    // Store token if verification successful
    if (response.data?.token) {
      this.token = response.data.token
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token)
        if (response.data.user) {
          localStorage.setItem('user_data', JSON.stringify(response.data.user))
        }
      }
    }

    return response
  }

  async completeProfile(phoneNumber: string, fullName: string, email?: string) {
    const response = await this.request('/api/auth/complete-profile/', {
      method: 'POST',
      body: JSON.stringify({
        phone_number: phoneNumber,
        full_name: fullName,
        email: email || '',
      }),
    })

    // Store token and user data
    if (response.data?.token) {
      this.token = response.data.token
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', response.data.token)
        localStorage.setItem('user_data', JSON.stringify(response.data.user))
      }
    }

    return response
  }

  async getProfile() {
    return this.request('/api/auth/profile/')
  }

  async updateProfile(data: any) {
    return this.request('/api/auth/profile/update/', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  }

  async uploadAvatar(file: File) {
    const formData = new FormData()
    formData.append('avatar', file)

    return this.request('/api/auth/profile/avatar/', {
      method: 'POST',
      body: formData,
      headers: {
        // Don't set Content-Type for FormData
      },
    })
  }

  // Utility methods
  setToken(token: string) {
    this.token = token
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token)
    }
  }

  clearAuth() {
    this.token = null
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_data')
    }
  }

  isAuthenticated(): boolean {
    return !!this.token
  }

  getCurrentUser() {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user_data')
      return userData ? JSON.parse(userData) : null
    }
    return null
  }
}

// Export singleton instance
export const apiService = new ApiService()
export default apiService