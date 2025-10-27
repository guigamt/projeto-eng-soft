import { authHttp } from "./http";
import type {
  AuthUser,
  LogoutResponse,
  RegisterPayload,
  TokenResponse
} from "../types/auth";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  async login(payload: LoginPayload): Promise<TokenResponse> {
    const { data } = await authHttp.post<TokenResponse>("/login", payload);
    return data;
  },

  async register(payload: RegisterPayload): Promise<AuthUser> {
    const { data } = await authHttp.post<AuthUser>("/register", payload);
    return data;
  },

  async logout(): Promise<LogoutResponse> {
    const { data } = await authHttp.post<LogoutResponse>("/logout");
    return data;
  },

  async me(): Promise<AuthUser> {
    const { data } = await authHttp.get<AuthUser>("/me");
    return data;
  }
};
