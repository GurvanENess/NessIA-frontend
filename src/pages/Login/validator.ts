import { LoginCredentials, LoginErrors } from "./entities/entities";

const validateForm = ({
  email,
  password,
}: LoginCredentials): LoginErrors | null => {
  const newErrors: LoginErrors = {};

  if (!email) {
    newErrors.email = "L'email est requis";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = "L'email n'est pas valide";
  }

  if (!password) {
    newErrors.password = "Le mot de passe est requis";
  }

  return Object.keys(newErrors).length > 0 ? newErrors : null;
};

export default validateForm;
