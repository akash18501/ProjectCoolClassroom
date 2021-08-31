import React from "react";
import { Route, Switch } from "react-router";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Home from "./Home";
import NavBar from "./components/Navigation/NavBar";
import "./Styles/App.css";
import NewClass from "./components/Teacher/NewClass";
import Enroll from "./components/Student/Enroll";
import AllClasses from "./components/Student/AllClasses";
import MyClasses from "./components/Teacher/MyClasses";
import Logout from "./components/Logout";
import CreateAssignments from "./components/Teacher/CreateAssignments";
import Assignments from "./components/Student/Assignments";
import MyAssignments from "./components/Teacher/MyAssignments";
import Submissions from "./components/Teacher/Submissions";
import Schedule from "./components/Teacher/Schedule";
import ViewSchedules from "./components/ViewSchedules";
import CreateTests from "./components/Teacher/CreateTests";
import Tests from "./components/Student/Tests";
import MyTests from "./components/Teacher/MyTests";
import TestSubmission from "./components/Teacher/TestSubmission";

const App = () => {
  return (
    <div className="container-fluid app_container p-0">
      <NavBar />
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={SignUp} />
        <Route exact path="/signin" component={SignIn} />
        <Route exact path="/newclass" component={NewClass} />
        <Route exact path="/enroll" component={Enroll} />
        <Route exact path="/allclasses" component={AllClasses} />
        <Route exact path="/myclasses" component={MyClasses} />
        <Route exact path="/logout" component={Logout} />
        <Route exact path="/createassignment" component={CreateAssignments} />
        <Route exact path="/assignments" component={Assignments} />
        <Route exact path="/myassignments" component={MyAssignments} />
        <Route exact path="/assignments/:id" component={Submissions} />
        <Route exact path="/scheduleclass" component={Schedule} />
        <Route exact path="/schedules/:c" component={ViewSchedules} />
        <Route exact path="/createtest" component={CreateTests} />
        <Route exact path="/tests" component={Tests} />
        <Route exact path="/mytests" component={MyTests} />
        <Route exact path="/tests/:id" component={TestSubmission} />
      </Switch>
    </div>
  );
};

export default App;
