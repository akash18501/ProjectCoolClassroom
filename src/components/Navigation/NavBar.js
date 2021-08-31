import React from "react";
import { Link } from "react-router-dom";
import { FaBars } from "react-icons/fa";
import { useState, useEffect } from "react";
import { BiArrowBack } from "react-icons/bi";
import {
  SideBarData as data,
  sideBarDataTeacher as teacherData,
  noUserData,
} from "./SideBarData";
import { connect } from "react-redux";
import "../../Styles/App.css";

const NavBar = ({ loggedUser }) => {
  console.log("loggedUser is inside navbar", loggedUser);
  const [toggleSidebar, setToggleSideBar] = useState(false);
  const [isLoggedIn, setisLoggedIn] = useState(false);
  const [isStudent, setIsStudent] = useState(true);

  const getSidebarValues = () => {
    console.log("no user data is", noUserData);
    if (isLoggedIn === false) {
      return noUserData.map((d, i) => {
        return (
          <li key={i} className={d.cname}>
            <Link to={d.path}>{d.title}</Link>
          </li>
        );
      });
    } else if (isStudent === true) {
      return data.map((d, i) => {
        return (
          <li key={i} className={d.cname}>
            <Link to={d.path}>{d.title}</Link>
          </li>
        );
      });
    } else if (isStudent === false) {
      return teacherData.map((d, i) => {
        return (
          <li key={i} className={d.cname}>
            <Link to={d.path}>{d.title}</Link>
          </li>
        );
      });
    }
  };

  useEffect(() => {
    if (loggedUser.isSignedIn) {
      setisLoggedIn(true);
      if (loggedUser.id_type === "student") setIsStudent(true);
      else setIsStudent(false);
    } else {
      setisLoggedIn(false);
    }
  }, [loggedUser]);

  useEffect(() => {
    console.log("is logged inside useeffect of navbar", isLoggedIn);
  }, [isLoggedIn]);

  const showSideBar = () => {
    setToggleSideBar(!toggleSidebar);
  };

  return (
    <>
      <nav className="custom_navbar">
        <div className="brand">
          <Link to="#" className="menu_bars" onClick={showSideBar}>
            <FaBars />
          </Link>
          <Link to="/" className="login_button">
            <h2>Cool Classrooms</h2>
          </Link>
        </div>
        {isLoggedIn ? (
          <ul className="nav_list">
            <il className="m-5">
              <Link to="/logout" className="login_button">
                Logout
              </Link>
            </il>
          </ul>
        ) : (
          <ul className="nav_list">
            <il className="m-5">
              <Link to="/signin" className="login_button">
                Login
              </Link>
            </il>
            <il>
              <Link to="/signup" className="login_button">
                SignUp
              </Link>
            </il>
          </ul>
        )}
      </nav>
      <div>
        <nav className={toggleSidebar ? "nav_menu active" : "nav_menu"}>
          <ul className="nav_menu_items" onClick={showSideBar}>
            <li className="navbar_toggle">
              <Link to="#" className="menu_bars_cross">
                <BiArrowBack />
              </Link>
            </li>
            {getSidebarValues()}
          </ul>
        </nav>
      </div>
    </>
  );
};

const mapStateToProps = (state) => {
  console.log("insde navbar", state);
  return {
    loggedUser: state.loggedInUser,
  };
};

export default connect(mapStateToProps, null)(NavBar);
