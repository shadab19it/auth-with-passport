import React, { FC } from "react";
import "./SignUp.scss";
import Form from "../../components/Form/Form";
import { State } from "../Login/Login";
import { AuthSignUp } from "../../services/AuthService";
import { useHistory } from "react-router-dom";

const SignUp: FC = () => {
  const history = useHistory();
  const [values, setValues] = React.useState<State>({
    username: "zik",
    password: "123",
    email: "zikra@gmail.com",
  });

  const handleChange = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [f]: e.target.value });
  };
  const onSubmit = (e: any) => {
    e.preventDefault();
    AuthSignUp(values, (r) => {
      if (r.msg) {
        setValues({ ...values, username: "", email: "", password: "" });
        history.push("/login");
      }
    });
  };

  return (
    <div className='signup-wrapper'>
      <Form onSubmit={onSubmit} value={values} handleChange={handleChange} />
    </div>
  );
};

export default SignUp;
