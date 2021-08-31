import React from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { NavLink } from "react-router-dom";
import { axiosInstance } from "../api";
import { useHistory } from "react-router-dom";
import { useState } from "react";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import Notification from "./Notification";

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
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  signupcon: {
    marginBottom: "100px",
  },
  selectbutton: {
    width: "100%",
  },
}));

export default function SignUp() {
  const classes = useStyles();

  const initialUserData = Object.freeze({
    first_name: "",
    last_name: "",
    regno: "",
    password: "",
    email: "",
    is_teacher: false,
    is_student: false,
    username: "",
  });

  const [usertype, setUserType] = useState("");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const history = useHistory();
  const [userData, setUserData] = useState(initialUserData);

  const handleChange = (e) => {
    console.log(e.target.value);
    setUserData((prevData) => {
      return {
        ...prevData,
        [e.target.name]: e.target.value,
      };
    });
  };

  const handleSelectChange = (e) => {
    setUserType(e.target.value);
    if (e.target.value === "student") {
      setUserData((prevData) => {
        return {
          ...prevData,
          is_student: true,
          is_teacher: false,
        };
      });
    } else if (e.target.value === "teacher") {
      setUserData((prevData) => {
        return {
          ...prevData,
          is_student: false,
          is_teacher: true,
        };
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const body = {
      first_name: userData.first_name,
      last_name: userData.last_name,
      username: userData.first_name + userData.last_name,
      password: userData.password,
      regno: userData.regno,
      email: userData.email,
      teacher: userData.is_teacher,
      student: userData.is_student,
      username: userData.username,
    };
    if (
      body.first_name === "" ||
      body.last_name === "" ||
      body.username === "" ||
      body.password === "" ||
      body.regno === "" ||
      body.email === "" ||
      (body.teacher === false && body.student === false)
    ) {
      setMessage("Please Fill All the fields");
      setMessageType("danger");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }
    console.log("body is", body);
    // history.push("/signin");

    axiosInstance
      .post("auth/register/", body)
      .then((response) => {
        console.log("register response", response);
        console.log("register response data", response.data);
        setMessage("Registration Successfull");
        setMessageType("success");
        setTimeout(() => {
          setMessage("");
          history.push("/signin");
        }, 300);
      })
      .catch((error) => {
        setMessage(error.response.data.msg);
        setMessageType("danger");
        setTimeout(() => {
          setMessage("");
        }, 2000);
      });
  };

  return (
    <Container component="main" maxWidth="xs" className={classes.signupcon}>
      {message && <Notification message={message} type={messageType} />}
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="username / handle"
                name="username"
                value={userData.username}
                onChange={handleChange}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="first_name"
                variant="outlined"
                required
                fullWidth
                id="username"
                label="first name"
                value={userData.first_name}
                onChange={handleChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="last name"
                name="last_name"
                value={userData.last_name}
                onChange={handleChange}
                autoComplete="lname"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="registration no"
                name="regno"
                value={userData.regno}
                onChange={handleChange}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={userData.email}
                onChange={handleChange}
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={userData.password}
                onChange={handleChange}
                autoComplete="current-password"
              />
            </Grid>
            <Grid item xs={12}>
              <InputLabel id="demo-simple-select-label">user type</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={usertype}
                onChange={handleSelectChange}
                label="Age"
                className={classes.selectbutton}
              >
                <MenuItem value={"teacher"}>Teacher</MenuItem>
                <MenuItem value={"student"}>Student</MenuItem>
              </Select>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <NavLink to="/signin" variant="body2">
                Already have an account? Sign in
              </NavLink>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
}
