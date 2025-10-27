export type UserRole = "COLLABORATOR" | "IDEALIZER" | "ADMIN";

export interface AuthUser {
  id: number;
  email: string;
  full_name: string | null;
  role: UserRole;
  is_active: boolean;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface LogoutResponse {
  detail: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  full_name?: string;
  role?: UserRole;
}
