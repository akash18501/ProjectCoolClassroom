import React from "react";
import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../api";
import { connect } from "react-redux";
import { logoutuser } from "../actions";

const Logout = ({ logoutuser2 }) => {
  const history = useHistory();
  useEffect(() => {
    const logoutuser = async () => {
      axiosInstance
        .post("auth/logout/", {
          token: localStorage.getItem("refresh_token"),
        })
        .then((response) => {
          console.log("hello world what the fuck");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          axiosInstance.defaults.headers["Authorization"] = null;
          logoutuser2();
          history.push("/");
        })
        .catch((error) => {
          console.log("error is while logging out", error);
        });
    };
    logoutuser();
  });
  return <div></div>;
};

const mapStateToProps = (state) => {
  return {};
};

export default connect(mapStateToProps, {
  logoutuser2: logoutuser,
})(Logout);
