import { useReducer } from "react";
import { RegisterErrors } from "../entities/entities";

interface State {
  isLoading: boolean;
  errors: RegisterErrors;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERRORS"; payload: RegisterErrors };

const initialState: State = { isLoading: false, errors: {} };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, isLoading: action.payload };
    case "SET_ERRORS":
      return { ...state, errors: action.payload };
    default:
      return state;
  }
}

export const useRegisterStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  };

  const setErrors = (errors: RegisterErrors) => {
    dispatch({ type: "SET_ERRORS", payload: errors });
  };

  return {
    ...state,
    setLoading,
    setErrors,
  };
};