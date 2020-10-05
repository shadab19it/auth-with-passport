import React, { FC } from "react";
import Form from "../../components/Form/Form";
import { Authenticate, AuthLogin } from "../../services/AuthService";
import { useHistory } from "react-router-dom";

export interface State {
  username?: string;
  password: string;
  email: string;
}

const Login: FC = () => {
  const history = useHistory();
  const [values, setValues] = React.useState<State>({
    password: "",
    email: "",
  });
  const { email, password } = values;

  const handleChange = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [f]: e.target.value });
  };
  const onSubmit = () => {
    if (email && password) {
      AuthLogin(values, (r) => {
        Authenticate(r, () => {
          history.push("/");
        });
      });
    } else {
      alert("Please Enter any value");
    }
  };

  return (
    <div className='login-wrapper'>
      <Form formType='login' value={values} onSubmit={onSubmit} handleChange={handleChange} />
    </div>
  );
};

export default Login;
