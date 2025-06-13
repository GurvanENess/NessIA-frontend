export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

export interface RegisterErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
}