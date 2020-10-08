import { Backdrop, Button, CircularProgress, createStyles, makeStyles, Theme } from "@material-ui/core";
import React, { FC, useState } from "react";
import EmailIcon from "@material-ui/icons/Email";
import { useParams, useHistory } from "react-router-dom";
import { ConfrimEmail } from "../../services/AuthService";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

interface State {
  msg: string;
  isDisabled: boolean;
}

const EmailConfirm: FC = () => {
  const { token } = useParams() as { token: string };
  const history = useHistory();
  const classes = useStyles();
  const [open, setOpen] = useState<boolean>(false);
  const [state, setState] = useState<State>({
    msg: "",
    isDisabled: false,
  });

  console.log(token);

  const ActvateEmail = () => {
    setOpen((o: boolean) => !o);
    ConfrimEmail(token, (r) => {
      setOpen(false);
      setState({ ...state, msg: r.msg, isDisabled: true });
    });
  };
  const { msg, isDisabled } = state;
  return (
    <div
      className='email-confrim-wrapper'
      style={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
      }}>
      <div className='confirm-link' style={{ textAlign: "center", paddingTop: "200px", margin: "0 auto" }}>
        <h2 style={{ textAlign: "center", fontSize: "3rem", color: "#fff", fontWeight: 400, marginBottom: "30px" }}>
          Confirm Your Email id , Click The below Link .
        </h2>

        {/* {false && (
          <Alert severity='success' style={{ marginBottom: "20px", maxWidth: 500 }}>
            {state.msg} ,
            <span onClick={() => history.push("/login")} style={{ textDecoration: "underline", color: "blue", cursor: "pointer" }}>
              You Can Login
            </span>
          </Alert>
        )} */}
        <Button
          //   disabled={isDisabled}
          variant='contained'
          color={msg ? "secondary" : "primary"}
          size='large'
          onClick={ActvateEmail}
          style={{ minWidth: "300px", minHeight: "50px" }}
          endIcon={<EmailIcon />}
          disableElevation>
          {msg ? msg : " Click To Confirm Email"}
        </Button>
        <Backdrop className={classes.backdrop} open={open}>
          <CircularProgress color='inherit' />
        </Backdrop>
      </div>
    </div>
  );
};

export default EmailConfirm;
