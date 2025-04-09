export interface User {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  birthDate?: string | undefined;
  role: 'admin' | 'user';
  position?: string | undefined;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}