import React, { FC } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import Header from "../components/Header/Header";
import Login from "../pages/Login/Login";
import Main from "../pages/Main";
import NoMatch from "../pages/PageNotFound";
import SignUp from "../pages/SignUp/SignUp";

const MRouter: FC = () => {
  return (
    <Router>
      <Header />
      <Switch>
        <Route exact path='/' component={Main} />
        <Route exact path='/signup' component={SignUp} />
        <Route exact path='/login' component={Login} />
        <Route path='*' component={NoMatch} />
      </Switch>
    </Router>
  );
};

export default MRouter;
