import { LOGIN_USER, LOGOUT_USER } from "./types";

export const loginuser = (user) => {
  console.log("inside login creator", user);
  return {
    type: LOGIN_USER,
    payload: user,
  };
};

export const logoutuser = () => {
  return {
    type: LOGOUT_USER,
  };
};
