// src/types/auth.ts

export interface AuthResponse {
  user(user: any): string;
  kind: string;
  localId: string;
  email: string;
  displayName: string;
  idToken: string;
  registered: boolean;
  profilePicture: string;
  refreshToken: string;
}

export interface UserConfig {
  instancia_sdr: string;
  fixed_nome: string;
  numero_destino: string;
  instancia_ia: string;
  numero_fixo_grupo: string;
  google_calendar_id: string;
}