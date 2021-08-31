import React, { useState, useEffect } from "react";
import { axiosInstance } from "../../api";
import "../../Styles/classList.css";
import { Link } from "react-router-dom";

function AllClasses() {
  const [allClasses, setAllClasses] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("auth/myclasses/")
      .then((response) => {
        console.log(response, "allsubjects");
        setAllClasses(response.data.myclasses);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const getAllSubjects = () => {
    const subjects = allClasses.map((c) => {
      return (
        <div className="class_card">
          <h2 className="class_head">{c}</h2>
          <Link to={`/schedules/${c}`}>
            <button className="class_btn">View Class</button>
          </Link>
        </div>
      );
    });
    console.log(subjects);
    return subjects;
  };

  return (
    <div className="class_container">
      {allClasses.length ? (
        <div className="class_grid">{getAllSubjects()}</div>
      ) : (
        <div style={{ width: "70vh", height: "70vh" }}>
          <h1>OOPS !! Looks Like You Haven't Created Any Class Yet</h1>
        </div>
      )}
    </div>
  );
}
export default AllClasses;
