export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  category: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface DashboardStats {
  total: number;
  pending: number;
  completed: number;
  highPriority: number;
  dueToday: number;
}

export interface TaskFilters {
  status?: 'all' | 'pending' | 'completed';
  priority?: Priority | 'ALL';
  category?: string;
  search?: string;
  sort?: 'newest' | 'oldest' | 'dueDate' | 'priority' | 'completed';
}
