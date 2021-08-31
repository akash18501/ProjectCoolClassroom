import React from "react";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { useState } from "react";
import { axiosInstance } from "../../api";
import Notification from "../Notification";
import { useHistory } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function NewClass() {
  const classes = useStyles();
  const history = useHistory();
  const [classname, setClassname] = useState("");
  const handleChange = (e) => {
    setClassname(e.target.value);
  };
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      subject_name: classname,
    };
    if (body.subject_name === "") {
      setMessage("Please Fille the subject Name");
      setMessageType("danger");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }
    console.log("body", body);

    axiosInstance
      .post("auth/createsubjects/", body)
      .then((response) => {
        setMessage(response.data.msg);
        setMessageType("success");
        setTimeout(() => {
          setMessage("");
          history.push("/");
        }, 2000);
      })
      .catch((errors) => {
        setMessage(errors.response.data.msg);
        setMessageType("danger");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      {message && <Notification message={message} type={messageType} />}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Create New Class
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Name of Class"
            name="subject_name"
            autoFocus
            value={classname}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create Class
          </Button>
        </form>
      </div>
    </Container>
  );
}
