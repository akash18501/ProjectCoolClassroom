import React from "react";
import { Link } from "react-router-dom";
import img from "../../img/homebg.jpg";

const GeneralHome = ({ isLoggedIn }) => {
  return (
    <div className="home_main d-flex w-100 bg-white">
      <div className="left_home d-flex flex-column justify-content-center align-items-start p-5">
        <h1 className="mb-5">Where Learning And Fun Comes Together</h1>
        <Link to="/signin">
          <button
            className={`pl-3 pr-3 py-2 buttonsvg btn btn-primary ${
              isLoggedIn ? "d-none" : ""
            }`}
          >
            Go To Classroom
          </button>
        </Link>
      </div>
      <img
        className="svgimg"
        src={img}
        height="90%"
        alt="homepage background"
      ></img>
    </div>
  );
};

export default GeneralHome;
