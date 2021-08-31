import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import { axiosInstance } from "../../api";
import "../../Styles/classList.css";

function AllClasses() {
  const [allClasses, setAllClasses] = useState([]);

  useEffect(() => {
    axiosInstance
      .get("auth/allsubjects/")
      .then((response) => {
        console.log(response, "allsubjects");
        setAllClasses(response.data.subjects);
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
          {/* <button className="class_btn">View Class</button> */}
        </div>
      );
    });
    console.log(subjects);
    return subjects;
  };

  return (
    <div className="class_container">
      <div className="class_grid">{getAllSubjects()}</div>
    </div>
  );
}
export default AllClasses;
