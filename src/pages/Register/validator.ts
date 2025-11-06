import { RegisterCredentials, RegisterErrors } from "./entities/entities";

const validateForm = ({
  email,
  password,
  confirmPassword,
  username,
}: RegisterCredentials): RegisterErrors | null => {
  const newErrors: RegisterErrors = {};

  if (!username) {
    newErrors.username = "Le nom d'utilisateur est requis";
  } else if (username.length < 3) {
    newErrors.username = "Le nom d'utilisateur doit contenir au moins 3 caractères";
  }

  if (!email) {
    newErrors.email = "L'email est requis";
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = "L'email n'est pas valide";
  }

  if (!password) {
    newErrors.password = "Le mot de passe est requis";
  } else if (password.length < 6) {
    newErrors.password = "Le mot de passe doit contenir au moins 6 caractères";
  }

  if (!confirmPassword) {
    newErrors.confirmPassword = "La confirmation du mot de passe est requise";
  } else if (password !== confirmPassword) {
    newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  return Object.keys(newErrors).length > 0 ? newErrors : null;
};

export default validateForm;