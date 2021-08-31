import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import "../../Styles/Submissions.css";
import { axiosInstance } from "../../api";

const TestSubmission = () => {
  const { id } = useParams();
  const [submissionData, setsubmissionData] = useState([]);
  const [grades, setGrades] = useState("");
  const [gradestatus, setGradeStatus] = useState(false);
  const [currGradeId, setCurrentGradeId] = useState("");
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    axiosInstance
      .post("auth/seeanswers/", {
        assg_id: id,
      })
      .then((response) => {
        console.log("res in se answers", response);
        setsubmissionData(response.data);
      })
      .catch((error) => {});
  }, [grading]);

  const handleGradeChange = (e) => setGrades(e.target.value);
  const giveGrades = (e, subid) => {
    e.preventDefault();
    setGrading(true);
    setGradeStatus(false);
    setGrades(null);
    const body = {
      sub_id: subid,
      marks: grades,
    };
    console.log("body", body);
    axiosInstance
      .post("auth/testmarks/", body)
      .then((response) => {
        console.log("response give marks", response);
        setGrading(false);
      })
      .catch((response) => {});
  };

  const changeGradeStatus = (gradeid) => {
    setGradeStatus(true);
    setCurrentGradeId(gradeid);
  };

  const getAllAssignments = () => {
    return submissionData.map((data, i) => {
      return (
        <tr>
          <td style={{ fontSize: "1rem" }} className="text-center">
            <strong class="student_name">{data[0]}</strong>
          </td>
          <td className="text-center">
            <a
              href={data[1]}
              target="_blank"
              className="btn btn-success assign_submission my-auto"
            >
              view submission
            </a>
          </td>
          <td className="text-center">
            {gradestatus && currGradeId === data[2] ? (
              <form
                className="d-flex flex-column align-items-center"
                onSubmit={(e) => giveGrades(e, data[2])}
              >
                <div>
                  <label className="mr-5" for="marks">
                    Marks:{" "}
                  </label>
                  <input
                    className="marks_input"
                    type="text"
                    id="marks"
                    value={grades}
                    onChange={handleGradeChange}
                  />
                </div>
                <input type="submit" value="Grade" className="btn give_marks" />
              </form>
            ) : data[3] ? (
              <button className="btn btn-light text-dark assign_submission">
                Graded {data[3]}
              </button>
            ) : (
              <button
                className="btn give_marks"
                onClick={() => changeGradeStatus(data[2])}
              >
                Give Grades
              </button>
            )}
          </td>
        </tr>
      );
    });
  };

  return (
    <div className="p-5">
      <table class="table table-striped table-hover table-bordered submissions_table">
        <thead className="thead_row">
          <tr className="text-white">
            <th scope="col">Student Name</th>
            <th scope="col">Submission</th>
            <th scope="col">Give Marks</th>
          </tr>
        </thead>
        <tbody>{getAllAssignments()}</tbody>
      </table>
    </div>
  );
};

export default TestSubmission;
