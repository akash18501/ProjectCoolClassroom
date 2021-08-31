import React, { useState, useEffect } from "react";
import "./Styles/Home.css";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import StudentHome from "./components/homepages/StudentHome";
import TeacherHome from "./components/homepages/TeacherHome";
import GeneralHome from "./components/homepages/GeneralHome";
import bggrey from "./img/bggrey.jpg";

const Home = ({ loggedUser }) => {
  console.log("loggedUser is inside home", loggedUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isStudent, setIsStudent] = useState(true);

  useEffect(() => {
    if (loggedUser.isSignedIn) {
      setIsLoggedIn(true);
      if (loggedUser.id_type === "student") setIsStudent(true);
      else setIsStudent(false);
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    console.log("is logged inside useeffect", isLoggedIn);
  }, [isLoggedIn]);

  return (
    <div className={`home_container ${isLoggedIn ? "home_container_bg" : ""}`}>
      {isLoggedIn ? (
        isStudent ? (
          <StudentHome></StudentHome>
        ) : (
          <TeacherHome></TeacherHome>
        )
      ) : (
        <GeneralHome isLoggedIn={isLoggedIn} />
      )}
    </div>
  );
};

const mapStateToProps = (state) => {
  console.log("state is", state);
  return {
    loggedUser: state.loggedInUser,
  };
};

export default connect(mapStateToProps, null)(Home);
