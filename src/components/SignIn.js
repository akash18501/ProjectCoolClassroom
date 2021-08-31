import React, { useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { axiosInstance } from "../api";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import { connect } from "react-redux";
import { loginuser } from "../actions";
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
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  selectbutton: {
    width: "100%",
  },
}));

const SignIn = ({ loginuser }) => {
  const classes = useStyles();
  const history = useHistory();

  const initialUserData = Object.freeze({
    username: "",
    password: "",
    is_student: false,
    is_teacher: false,
  });
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const [usertype, setUserType] = useState("");

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
      username: userData.username,
      password: userData.password,
      is_student: userData.is_student,
      is_teacher: userData.is_teacher,
    };
    if (
      body.username === "" ||
      body.password === "" ||
      (body.is_student === false && body.is_teacher === false)
    ) {
      setMessage("Please fill all the fields");
      setMessageType("danger");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }
    console.log("body is: ", body);
    axiosInstance
      .post("auth/login/", body)
      .then((response) => {
        console.log("response login is", response);
        console.log("token", response.data.tokens.access_token);
        localStorage.setItem("access_token", response.data.tokens.access_token);
        localStorage.setItem(
          "refresh_token",
          response.data.tokens.refresh_token
        );
        axiosInstance.defaults.headers["Authorization"] =
          "JWT " + localStorage.getItem("access_token");
        let currentUser = {
          username: response.data.user.username,
          email: response.data.user.email,
          id_type: response.data.user.id_type,
        };
        loginuser(currentUser);
        history.push("/");
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
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="username"
            name="username"
            autoComplete="email"
            value={userData.username}
            onChange={handleChange}
            autoFocus
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={userData.password}
            onChange={handleChange}
          />
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item xs></Grid>
            <Grid item>
              <Link to="/signup" variant="body2">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default connect(null, {
  loginuser: loginuser,
})(SignIn);
