import { Container } from "@material-ui/core";
import React, { FC, useEffect } from "react";
import Button from "@material-ui/core/Button";
import { useHistory } from "react-router-dom";
import "./Main.scss";
import { isAuthenticated } from "../services/AuthService";

const Main: FC = () => {
  const history = useHistory();
  const user = isAuthenticated();

  return (
    <div className='main-wrapper'>
      <Container disableGutters={true} maxWidth='lg' className='middle-content'>
        <div className='left-hero-content'>
          <h2>The world best Places to Visit !</h2>
          <p>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Dicta hic aspernatur porro odit dolores consequatur veniam laborum
            repudiandae quis fugit?
          </p>
          {user && <h3>Wellcome To dream Tourist !</h3>}
          {!user && (
            <>
              <div className='action-btns'>
                <Button variant='contained' style={{ marginRight: "30px" }} onClick={() => history.push("/login")}>
                  Login
                </Button>
                <Button variant='contained' size='medium' color='primary' onClick={() => history.push("/signup")}>
                  SignUp
                </Button>
              </div>
            </>
          )}
        </div>
      </Container>
    </div>
  );
};

export default Main;
