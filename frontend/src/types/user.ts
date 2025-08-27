export interface User {
  id: string;
  name: string;
  email: string;
  active: boolean;
  createdAt: string;
  role: string;
  department: string;
  country: string;
  city: string;
  lastLoginAt: string | null;
  phone: string | null;
  avatarUrl: string | null;
  bio: string | null;
  tags: string[];
}