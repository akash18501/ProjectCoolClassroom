import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../api";
import "../../Styles/studentAssign.css";
import { Link } from "react-router-dom";

const MyTests = () => {
  const [studAssignment, setStudAssignment] = useState([]);
  useEffect(() => {
    axiosInstance
      .get("auth/mytests/")
      .then((response) => {
        console.log("response test teacher", response);
        setStudAssignment(response.data);
      })
      .catch((error) => {});
  }, []);

  const getAssignmentList = () => {
    return studAssignment.map((data, i) => {
      return (
        <Link
          key={data[5]}
          to={`/tests/${data[5]}`}
          className="assign_drill_link"
        >
          <div className="assign_card assign_card_teacher">
            <div className="assign_head w-100">
              <h4>
                {data[0]} <span style={{ fontSize: "1rem" }}>({data[1]})</span>{" "}
                <span>
                  {" "}
                  <a
                    href={data[2]}
                    target="_blank"
                    style={{ textDecoration: "none" }}
                    className="btn btn-sm btn-success "
                  >
                    View Test Paper
                  </a>
                </span>
              </h4>
              <div>
                <div className="start_Date">
                  <string>Test Date: </string> {data[3]}
                </div>
                <div className="end_Date">
                  <bold>
                    <span className="text-danger">Duration:</span>{" "}
                  </bold>{" "}
                  {data[4]} mins
                </div>
              </div>
            </div>
          </div>
        </Link>
      );
    });
  };

  return studAssignment.length ? (
    <div className="assign_container">{getAssignmentList()}</div>
  ) : (
    <div style={{ width: "70vh", height: "70vh" }} className="m-5">
      <h1 className="mt-5 pt-5">
        OOPS !! Looks Like You Haven't Created Any Assignments Yet
      </h1>
    </div>
  );
};

export default MyTests;
