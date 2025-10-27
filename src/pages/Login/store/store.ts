import { useReducer } from "react";
import { LoginErrors } from "../entities/entities";

// Les credentials ne doivent pas être dans le store car ils concernent l'UI en lui-même

interface State {
  isLoading: boolean;
  errors: LoginErrors;
}

type Action =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERRORS"; payload: LoginErrors };

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

export const useLoginStore = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  const setLoading = (isLoading: boolean) => {
    dispatch({ type: "SET_LOADING", payload: isLoading });
  };

  const setErrors = (errors: LoginErrors) => {
    dispatch({ type: "SET_ERRORS", payload: errors });
  };

  return {
    ...state,
    setLoading,
    setErrors,
  };
};
