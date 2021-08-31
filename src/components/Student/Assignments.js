import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../api";
import "../../Styles/studentAssign.css";
import FileBase64 from "react-file-base64";

const Assignments = () => {
  const [studAssignment, setStudAssignment] = useState([]);
  const [assignFile, setAssignFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [subId, setSubId] = useState(-1);
  useEffect(() => {
    axiosInstance
      .get("auth/assignments/")
      .then((response) => {
        console.log("response assign", response);
        setStudAssignment(response.data);
      })
      .catch((error) => {});
  }, [submitted]);

  const handleChange = (e) => {
    let image_file = e.target.files[0];
    setAssignFile(image_file);
  };

  const submitAssignments = (e, value) => {
    e.preventDefault();
    const formdata = new FormData();

    formdata.append("assg_file", assignFile);
    formdata.append("assg_id", value);
    setSubmitted(true);
    setSubId(value);
    axiosInstance
      .post("auth/makesubmission/", formdata)
      .then((response) => {
        console.log("assign res", response);
        alert("assignment Submitted Successfully");
        setSubmitted(false);
        setSubId(-1);
      })
      .catch((error) => {});
  };

  const getAssignmentList = () => {
    return studAssignment.map((data, i) => {
      return (
        <div key={data[6]} className="assign_card">
          <div className="assign_head w-100">
            <h3>
              {data[0]} <span style={{ fontSize: "1rem" }}>({data[1]})</span>
            </h3>
            <p>- by {data[5]}</p>
          </div>

          <div className="assign_info">
            <div className="assign_details">
              <div className="desc_detials mb-2">{data[2]}</div>
              <div className="start_Date">
                <string>start date: </string> {data[3]}
              </div>
              <div className="end_Date">
                <bold>
                  <span className="text-danger">End Date:</span>{" "}
                </bold>{" "}
                {data[4]}
              </div>
            </div>
            {submitted === true && data[6] === subId ? (
              <div className="assign_submitted text-danger">Uploading ...</div>
            ) : data[7] === true ? (
              <div className="assign_submitted text-success">
                Submitted{" "}
                <span className="text-primary">
                  {data[8] ? ` (Grade: ${data[8]})` : `(Not Graded)`}
                </span>
              </div>
            ) : (
              <form
                className="assign_form"
                onSubmit={(e) => submitAssignments(e, data[6])}
              >
                {/* <FileBase64 multiple={false} onDone={handleChange} /> */}
                <input type="file" onChange={handleChange} />
                <input type="submit" className="assign_btn btn" />
              </form>
            )}
          </div>
        </div>
      );
    });
  };

  return <div className="assign_container">{getAssignmentList()}</div>;
};

export default Assignments;
