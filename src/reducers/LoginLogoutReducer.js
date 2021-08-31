import { LOGIN_USER, LOGOUT_USER } from "../actions/types";

const initialstate = {
  isSignedIn: null,
  username: null,
  id_type: null,
  email: null,
};

const LoginLogoutReducer = (state = initialstate, action) => {
  switch (action.type) {
    case LOGIN_USER:
      return {
        ...state,
        isSignedIn: true,
        username: action.payload.username,
        id_type: action.payload.id_type,
        email: action.payload.email,
      };
    case LOGOUT_USER:
      return {
        ...state,
        isSignedIn: false,
        username: null,
        id_type: null,
        email: null,
      };
    default:
      return state;
  }
};

export default LoginLogoutReducer;
