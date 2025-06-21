// Canister URL
const CANISTER_URL = `https://a4gq6-oaaaa-aaaab-qaa4q-cai.raw.icp0.io/?id=mosid-rqaaa-aaaah-arfzq-cai`;

// Custom API Error Class
export class ApiError extends Error {
  public data: any;
  public status: number;
  public statusText: string;

  constructor(data: any, status: number, statusText: string, message: string) {
    super(message);
    this.data = data;
    this.status = status;
    this.statusText = statusText;
    this.name = 'ApiError';
  }
}

// HTTP Client
class ApiClient {
  private baseURL: string;
  private requestInFlight: boolean = false;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    const defaultHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };

    const token = localStorage.getItem('auth_token');
    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    };

    try {
      this.requestInFlight = true;
      const response = await fetch(url, config);

      if (!response.ok) {
        throw new ApiError(
          await response.json(),
          response.status,
          response.statusText,
          await response.text()
        );
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      }

      return (await response.text()) as T;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      throw new ApiError(0, 0, '', (error as Error).message);
    } finally {
      this.requestInFlight = false;
    }
  }

  public isRequestInFlight(): boolean {
    return this.requestInFlight;
  }

  async get<T>(endpoint: string, params?: Record<string, any>): Promise<T> {
    const url = params ? this.buildUrl(endpoint, params) : endpoint;
    return this.request<T>(url, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }

  private buildUrl(endpoint: string, params: Record<string, any>): string {
    const url = new URL(endpoint, this.baseURL);
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.append(key, String(value));
      }
    });
    return url.pathname + url.search;
  }
}

// Create API client
export const apiClient = new ApiClient(CANISTER_URL);

// Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// API methods
export const api = {
  auth: {
    login: (credentials: { username: string; password: string }) =>
      apiClient.post<ApiResponse<{ token: string; user: any }>>('/auth/login', credentials),
    
    register: (userData: { username: string; email?: string; phone?: string }) =>
      apiClient.post<ApiResponse<{ token: string; user: any }>>('/auth/register', userData),
    
    logout: () =>
      apiClient.post<ApiResponse<void>>('/auth/logout'),
    
    getProfile: () =>
      apiClient.get<ApiResponse<any>>('/auth/profile'),
    
    updateProfile: (data: Partial<any>) =>
      apiClient.put<ApiResponse<any>>('/auth/profile', data),
    
    addBalance: (amount: number) =>
      apiClient.post<ApiResponse<any>>('/auth/balance', { amount }),
  },

  tournaments: {
    getAll: (params?: PaginationParams) =>
      apiClient.get<ApiResponse<any[]>>('/tournaments', params),
    
    getById: (id: string) =>
      apiClient.get<ApiResponse<any>>(`/tournaments/${id}`),
    
    getTeams: (tournamentId: string) =>
      apiClient.get<ApiResponse<any[]>>(`/tournaments/${tournamentId}/teams`),
    
    getPlayers: (teamId: string) =>
      apiClient.get<ApiResponse<any[]>>(`/teams/${teamId}/players`),
  },

  contests: {
    getByMatch: (matchId: string) =>
      apiClient.get<ApiResponse<any[]>>(`/matches/${matchId}/contests`),
    
    join: (contestId: string, teamId: string) =>
      apiClient.post<ApiResponse<any>>(`/contests/${contestId}/join`, { teamId }),
    
    getUserEntries: () =>
      apiClient.get<ApiResponse<any[]>>('/contests/my-entries'),
  },

  fantasy: {
    createTeam: (teamData: any) =>
      apiClient.post<ApiResponse<any>>('/fantasy/teams', teamData),
    
    getUserTeams: () =>
      apiClient.get<ApiResponse<any[]>>('/fantasy/teams'),
  },

  matches: {
    getAll: (params?: PaginationParams) =>
      apiClient.get<ApiResponse<any[]>>('/matches', params),
    
    getLive: () =>
      apiClient.get<ApiResponse<any[]>>('/matches/live'),
    
    getScore: (matchId: string) =>
      apiClient.get<ApiResponse<any>>(`/matches/${matchId}/score`),
  },

  rewards: {
    getPending: () =>
      apiClient.get<ApiResponse<any[]>>('/rewards/pending'),
    
    claim: (rewardId: string) =>
      apiClient.post<ApiResponse<any>>(`/rewards/${rewardId}/claim`),
    
    getTransactions: () =>
      apiClient.get<ApiResponse<any[]>>('/rewards/transactions'),
  },

  notifications: {
    getAll: () =>
      apiClient.get<ApiResponse<any[]>>('/notifications'),
    
    markAsRead: (notificationId: string) =>
      apiClient.put<ApiResponse<void>>(`/notifications/${notificationId}/read`),
    
    getUnreadCount: () =>
      apiClient.get<ApiResponse<{ count: number }>>('/notifications/unread-count'),
  },
};

export default api; 