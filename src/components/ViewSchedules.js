import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "../Styles/ViewClass.css";
import "../Styles/Submissions.css";
import { axiosInstance } from "../api";
import "../Styles/ViewSchedule.css";

// desc
// link

const ViewSchedules = () => {
  const { c } = useParams();
  const [allSchedules, setAllSchedules] = useState([]);

  useEffect(() => {
    axiosInstance
      .post("auth/getschedule/", {
        req_subject: c,
      })
      .then((response) => {
        console.log(response);
        setAllSchedules(response.data);
      })
      .catch((error) => {});
  }, []);

  const getAllSubmissions = () => {
    return allSchedules.map((data, index) => {
      return (
        <tr>
          <td className="subject_name">{data[0]}</td>
          <td className="description">{data[4]}</td>
          <td className="date">{data[1]}</td>
          <td>
            <div>
              <p>Start Time: {data[2]}</p>
              <p>
                <span className="text-danger">End Time:</span> {data[3]}
              </p>
            </div>
          </td>
          <td>
            <a
              href={data[5]}
              target="_blank"
              className="btn meet_link btn-success mt-3"
            >
              Join Meet
            </a>
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="p-5">
      <h3 className="mb-5">Your Schedules for {c} Class</h3>
      <table class="table table-striped table-hover table-bordered submissions_table">
        <thead className="thead_row">
          <tr className="text-white">
            <th scope="col" className="text-center">
              Subject
            </th>
            <th scope="col" className="text-center">
              Description
            </th>
            <th scope="col" className="text-center">
              Date
            </th>
            <th scope="col" className="text-center">
              Time
            </th>
            <th scope="col" className="text-center">
              Meeting Link
            </th>
          </tr>
        </thead>
        <tbody>{getAllSubmissions()}</tbody>
      </table>
    </div>
  );
};

export default ViewSchedules;
