import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import Grid from "@material-ui/core/Grid";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import { axiosInstance } from "../../api";
import { makeStyles } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import Notification from "../Notification";

const useStyles = makeStyles((theme) => ({
  selectbutton: {
    width: "100%",
  },
  form: {
    width: "400px", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
}));

// student_username

const Enroll = ({ loggedUser }) => {
  const classes = useStyles();
  const history = useHistory();
  const [subject, setSubject] = useState("");
  const [items, setItems] = useState([]);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const dropdownlist = () => {
    return items.map((subject, index) => {
      return (
        <MenuItem key={index} value={subject}>
          {subject}
        </MenuItem>
      );
    });
  };

  useEffect(() => {
    console.log("inside enrollment");
    axiosInstance
      .get("auth/selectsubject/")
      .then((response) => {
        setItems(response.data.for_selection_subjects);
      })
      .catch((error) => {});
  }, []);

  const handleSelectChange = (e) => {
    setSubject(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      subject: subject,
      student_username: loggedUser.username,
    };

    if (body.subject === "") {
      setMessage("Enter Subject Name");
      setMessageType("danger");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    axiosInstance
      .post("auth/enrollment/", body)
      .then((response) => {
        console.log(response);
        setMessage("SuccessFully Enrolled");
        setMessageType("success");
        setTimeout(() => {
          setMessage("");
          history.push("/");
        }, 1000);
      })
      .catch((error) => {
        setMessage("Can't Enroll !! Error");
        setMessageType("danger");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      });
  };

  return (
    <div
      style={{
        height: "90vh",
      }}
      className="enroll_container d-flex justify-content-center flex-column align-items-center"
    >
      {message && <Notification message={message} type={messageType} />}

      <form className={classes.form} noValidate onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <InputLabel id="demo-simple-select-label">
              Choose Class To Enroll
            </InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={subject}
              onChange={handleSelectChange}
              label="Age"
              className={classes.selectbutton}
            >
              {dropdownlist()}
            </Select>
          </Grid>
          <Grid item xs={12}>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Enroll
            </Button>
          </Grid>
        </Grid>
      </form>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    loggedUser: state.loggedInUser,
  };
};

export default connect(mapStateToProps, null)(Enroll);
