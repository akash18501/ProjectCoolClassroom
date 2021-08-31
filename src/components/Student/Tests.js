import React, { useEffect, useState } from "react";
import { axiosInstance } from "../../api";
import "../../Styles/studentAssign.css";
import FileBase64 from "react-file-base64";

const Tests = () => {
  const [studAssignment, setStudAssignment] = useState([]);
  const [assignFile, setAssignFile] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [subid, setSubId] = useState(-1);

  useEffect(() => {
    axiosInstance
      .get("auth/tests/")
      .then((response) => {
        console.log("response assign", response);
        setStudAssignment(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
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
      .post("auth/testsubmission/", formdata)
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
            <a
              href={data[5]}
              target="_blank"
              style={{ textDecoration: "none" }}
              className="btn btn-success "
            >
              View Test Paper
            </a>
          </div>

          <div className="assign_info">
            <div className="assign_details">
              <div className="desc_detials mb-2">Date: {data[2]}</div>
              <div className="start_Date">
                <string>Duration: </string> {data[3]} mins
              </div>
              <div className="end_Date">
                <bold>
                  <span className="text-danger">Test Out of:</span>{" "}
                </bold>{" "}
                {data[4]}
              </div>
            </div>
            {submitted === true && data[6] === subid ? (
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

export default Tests;
