import React, { FC } from "react";
import "./SignUp.scss";
import Form from "../../components/Form/Form";
import { State } from "../Login/Login";
import { AuthSignUp } from "../../services/AuthService";
import { useHistory } from "react-router-dom";
import { AlertToast } from "../../components/ErrorHandle/AlertInfo";

const SignUp: FC = () => {
  const history = useHistory();
  const [values, setValues] = React.useState<State>({
    username: "",
    password: "",
    password2: "",
    email: "",
  });
  const { username, password2, password, email } = values;

  const handleChange = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [f]: e.target.value });
  };
  const onSubmit = (e: any) => {
    e.preventDefault();
    AuthSignUp(values, (r) => {
      if (r.msg) {
        AlertToast(r.msg);
        setValues({ ...values, username: "", email: "", password: "", password2: "" });
        history.push("/login");
      }
    });
  };

  return (
    <div className='signup-wrapper'>
      <Form formType='signup' onSubmit={onSubmit} value={values} handleChange={handleChange} />
    </div>
  );
};

export default SignUp;
