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
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import "react-datepicker/dist/react-datepicker.css";
import { useEffect } from "react";
import { axiosInstance } from "../../api";
import Notification from "../Notification";
import "date-fns";
import DateFnsUtils from "@date-io/date-fns";
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from "@material-ui/pickers";

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
  datepicker: {
    width: "200px",
    height: "40px",
    paddingLeft: "20px",
  },
}));

const Schedule = () => {
  const classes = useStyles();
  const [allClasses, setAllClasses] = useState([]);
  const [subject, setSubject] = useState("");
  const [endDate, setEndDate] = useState(new Date());
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleTitleChange = (e) => setTitle(e.target.value);
  const handleDescChange = (e) => setDesc(e.target.value);

  const handleSelectChange = (e) => {
    setSubject(e.target.value);
  };

  useEffect(() => {
    axiosInstance
      .get("auth/myclasses/")
      .then((response) => {
        setAllClasses(response.data.myclasses);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const dropdownlist = () => {
    return allClasses.map((subject, index) => {
      return (
        <MenuItem key={index} value={subject}>
          {subject}
        </MenuItem>
      );
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const body = {
      link: title,
      desc: desc,
      schedule_date: `${endDate.getFullYear()}-${
        endDate.getMonth() + 1
      }-${endDate.getDate()}`,
      subject: subject,
      start_time: startTime.toLocaleTimeString(),
      end_time: endTime.toLocaleTimeString(),
    };

    console.log("schedule body is", body);

    if (body.link === "" || body.desc === "" || body.subject === "") {
      setMessage("Please Fill All the fields");
      setMessageType("danger");
      setTimeout(() => {
        setMessage("");
      }, 2000);
      return;
    }

    axiosInstance
      .post("auth/createschedule/", body)
      .then((response) => {
        console.log(response);
        setMessage("Meet Created  Successfully");
        setMessageType("success");
        setTimeout(() => {
          setMessage("");
        }, 2000);
        return;
      })
      .catch((error) => {
        console.log(error);
        setMessage(error.response.data.msg);
        setMessageType("danger");
        setTimeout(() => {
          setMessage("");
        }, 2000);
        return;
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      {message && <Notification message={message} type={messageType} />}
      <CssBaseline />
      <div className={classes.paper}>
        <Typography component="h1" variant="h5">
          Schedule New Meet
        </Typography>
        <form className={classes.form} noValidate onSubmit={handleSubmit}>
          <Grid item xs={12}>
            <InputLabel id="demo-simple-select-label">ClassName</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              label="Age"
              className={classes.selectbutton}
              value={subject}
              onChange={handleSelectChange}
            >
              {dropdownlist()}
            </Select>
          </Grid>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="desc"
            label="Description"
            value={desc}
            onChange={handleDescChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Meeting Link"
            name="title"
            autoFocus
            value={title}
            onChange={handleTitleChange}
          />

          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Grid item xs={12}>
              <KeyboardDatePicker
                margin="normal"
                id="date-picker-dialog"
                label="Schedule Date"
                format="MM/dd/yyyy"
                value={endDate}
                onChange={(date) => setEndDate(date)}
                KeyboardButtonProps={{
                  "aria-label": "change date",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="Start Time"
                value={startTime}
                onChange={(time) => setStartTime(time)}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <KeyboardTimePicker
                margin="normal"
                id="time-picker"
                label="End Time"
                value={endTime}
                onChange={(time) => setEndTime(time)}
                KeyboardButtonProps={{
                  "aria-label": "change time",
                }}
              />
            </Grid>
          </MuiPickersUtilsProvider>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Create Assignment
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Schedule;
