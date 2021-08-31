import { combineReducers } from "redux";
import LoginLogoutReducer from "./LoginLogoutReducer";

export const reducers = combineReducers({
  loggedInUser: LoginLogoutReducer,
});
