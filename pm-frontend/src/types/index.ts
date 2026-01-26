// Patient types
export interface Patient {
  id: string;
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
}

export interface PatientRequest {
  name: string;
  email: string;
  address: string;
  dateOfBirth: string;
  registrationDate: string;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

// Auth state
export interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}
