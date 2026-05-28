// API Layer for Flask Backend Integration
// This file contains all API calls that will connect to your Python Flask backend

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: string;
}

export interface Ticket {
  id: string;
  subject: string;
  description: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'NEW' | 'PROCESSING' | 'WAITING_FOR_CUSTOMER' | 'WAITING_ADMIN_APPROVAL' | 'RESOLVED' | 'REJECTED' | 'ESCALATED' | 'CLOSED';
  userId: string;
  userName: string;
  userEmail: string;
  aiConfidence: number;
  aiIntent: string;
  aiReasoning: string;
  aiSuggestedResolution: string;
  attachments: Attachment[];
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  ticketId: string;
  content: string;
  sender: 'user' | 'ai' | 'admin';
  senderName: string;
  createdAt: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface Document {
  id: string;
  name: string;
  url: string;
  type: string;
  status: 'active' | 'processing' | 'archived';
  version: number;
  uploadedAt: string;
  indexedAt?: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  ticketId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

export interface AnalyticsData {
  totalTickets: number;
  highPriorityTickets: number;
  escalatedTickets: number;
  avgResolutionTime: number;
  ticketsByCategory: { category: string; count: number }[];
  ticketsByStatus: { status: string; count: number }[];
  ticketsByPriority: { priority: string; count: number }[];
  ticketTrends: { date: string; count: number }[];
  aiConfidenceDistribution: { range: string; count: number }[];
}

// API Error Handler
class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'An error occurred' }));
    throw new ApiError(response.status, error.message);
  }
  return response.json();
}

// Auth API
export const authApi = {
  login: async (email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  register: async (name: string, email: string, password: string): Promise<{ user: User; token: string }> => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    return handleResponse(response);
  },

  logout: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
  },

  getCurrentUser: async (): Promise<User> => {
    const response = await fetch(`${API_BASE_URL}/auth/me`);
    return handleResponse(response);
  },
};

// Tickets API
export const ticketsApi = {
  getAll: async (filters?: {
    status?: string;
    priority?: string;
    category?: string;
  }): Promise<Ticket[]> => {
    const params = new URLSearchParams();
    if (filters?.status) params.append('status', filters.status);
    if (filters?.priority) params.append('priority', filters.priority);
    if (filters?.category) params.append('category', filters.category);
    
    const response = await fetch(`${API_BASE_URL}/tickets?${params}`);
    return handleResponse(response);
  },

  getById: async (id: string): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/tickets/${id}`);
    return handleResponse(response);
  },

  create: async (data: {
    subject: string;
    description: string;
    category: string;
    attachments?: File[];
  }): Promise<Ticket> => {
    const formData = new FormData();
    formData.append('subject', data.subject);
    formData.append('description', data.description);
    formData.append('category', data.category);
    data.attachments?.forEach((file) => formData.append('attachments', file));

    const response = await fetch(`${API_BASE_URL}/tickets`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  addMessage: async (ticketId: string, content: string): Promise<Message> => {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/messages`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content }),
    });
    return handleResponse(response);
  },

  updateStatus: async (ticketId: string, status: Ticket['status'], adminResponse?: string): Promise<Ticket> => {
    const response = await fetch(`${API_BASE_URL}/tickets/${ticketId}/status`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status, adminResponse }),
    });
    return handleResponse(response);
  },

  getUserTickets: async (): Promise<Ticket[]> => {
    const response = await fetch(`${API_BASE_URL}/tickets/user`);
    return handleResponse(response);
  },
};

// Chat API (AI Support)
export const chatApi = {
  sendMessage: async (message: string, conversationId?: string): Promise<{
    response: string;
    conversationId: string;
  }> => {
    const response = await fetch(`${API_BASE_URL}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, conversationId }),
    });
    return handleResponse(response);
  },

  getHistory: async (conversationId: string): Promise<ChatMessage[]> => {
    const response = await fetch(`${API_BASE_URL}/chat/${conversationId}/history`);
    return handleResponse(response);
  },
};

// Documents API
export const documentsApi = {
  getAll: async (): Promise<Document[]> => {
    const response = await fetch(`${API_BASE_URL}/documents`);
    return handleResponse(response);
  },

  upload: async (file: File): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      body: formData,
    });
    return handleResponse(response);
  },

  reindex: async (id: string): Promise<Document> => {
    const response = await fetch(`${API_BASE_URL}/documents/${id}/reindex`, {
      method: 'POST',
    });
    return handleResponse(response);
  },

  delete: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/documents/${id}`, { method: 'DELETE' });
  },
};

// Notifications API
export const notificationsApi = {
  getAll: async (): Promise<Notification[]> => {
    const response = await fetch(`${API_BASE_URL}/notifications`);
    return handleResponse(response);
  },

  markAsRead: async (id: string): Promise<void> => {
    await fetch(`${API_BASE_URL}/notifications/${id}/read`, { method: 'PATCH' });
  },

  markAllAsRead: async (): Promise<void> => {
    await fetch(`${API_BASE_URL}/notifications/read-all`, { method: 'PATCH' });
  },
};

// Analytics API
export const analyticsApi = {
  getDashboard: async (): Promise<AnalyticsData> => {
    const response = await fetch(`${API_BASE_URL}/analytics/dashboard`);
    return handleResponse(response);
  },

  getTicketTrends: async (period: 'week' | 'month' | 'year'): Promise<{ date: string; count: number }[]> => {
    const response = await fetch(`${API_BASE_URL}/analytics/trends?period=${period}`);
    return handleResponse(response);
  },
};

// AI Prediction API
export const aiApi = {
  predictPriority: async (subject: string, description: string): Promise<{
    priority: Ticket['priority'];
    confidence: number;
    intent: string;
    category: string;
  }> => {
    const response = await fetch(`${API_BASE_URL}/ai/predict`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, description }),
    });
    return handleResponse(response);
  },
};
