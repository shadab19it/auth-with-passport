import React, { FC } from "react";
import "./SignUp.scss";
import Form from "../../components/Form/Form";
import { State } from "../Login/Login";
import { AuthSignUp } from "../../services/AuthService";
import { useHistory } from "react-router-dom";
import { AlertToast } from "../../components/ErrorHandle/AlertInfo";
import { Backdrop, CircularProgress } from "@material-ui/core";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import { Alert } from "@material-ui/lab";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    backdrop: {
      zIndex: theme.zIndex.drawer + 1,
      color: "#fff",
    },
  })
);

const SignUp: FC = () => {
  const classes = useStyles();
  const [msg, setMsg] = React.useState<string>("");
  const [open, setOpen] = React.useState<boolean>(false);

  const history = useHistory();
  const [values, setValues] = React.useState<State>({
    username: "sfsdf",
    email: "shadabfeat@gmail.com",
    password: "123456",
    password2: "123456",
  });
  const { username, password2, password, email } = values;

  const handleChange = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [f]: e.target.value });
  };
  const onSubmit = (e: any) => {
    e.preventDefault();
    setOpen(true);
    AuthSignUp(values, (r) => {
      if (r) {
        setOpen(false);
        setMsg(r);
        // setValues({ ...values, username: "", email: "", password: "", password2: "" });
        // history.push("/login");
      }
    });
  };

  return (
    <div className='signup-wrapper'>
      <Form formType='signup' onSubmit={onSubmit} value={values} handleChange={handleChange} msg={msg} />
      <Backdrop className={classes.backdrop} open={open}>
        <CircularProgress color='inherit' />
      </Backdrop>
    </div>
  );
};

export default SignUp;
