import { Container } from "@material-ui/core";
import React, { FC, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import "./Main.scss";
import { test } from "../services/AuthService";

const Main: FC = () => {
  const history = useHistory();

  useEffect(() => {
    test();
  }, []);

  return (
    <div className='main-wrapper'>
      <Container disableGutters={true} maxWidth='lg' className='middle-content'>
        <div className='left-hero-content'>
          <h2>The world best Places to Visit !</h2>
          <button onClick={() => test()}>click</button>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta hic aspernatur porro odit dolores consequatur veniam laborum
            repudiandae quis fugit?
          </p>
          <div className='action-btns'>
            <Button variant='contained' style={{ marginRight: "30px" }} onClick={() => history.push("/login")}>
              Login
            </Button>
            <Button variant='contained' size='medium' color='primary' onClick={() => history.push("/signup")}>
              SignUp
            </Button>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Main;
