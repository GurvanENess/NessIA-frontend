export interface FormDataType {
  email: string;
  password: string;
  confirmPassword: string;
  username: string;
}

export interface FormErrorsType {
  email?: string;
  password?: string;
  confirmPassword?: string;
  username?: string;
}
