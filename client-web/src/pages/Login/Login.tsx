import React, { FC } from "react";
import Form from "../../components/Form/Form";
import { Authenticate, AuthLogin, ResProfile } from "../../services/AuthService";
import { useHistory } from "react-router-dom";

export interface State {
  username?: string;
  password: string;
  password2?: string;
  email: string;
}

const Login: FC = () => {
  const history = useHistory();
  const [values, setValues] = React.useState<State>({
    password: "",
    email: "",
  });

  const handleChange = (f: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [f]: e.target.value });
  };
  const onSubmit = () => {
    AuthLogin(values, (r: ResProfile) => {
      Authenticate(r.profile, () => {
        history.push("/");
      });
    });
  };

  return (
    <div className='login-wrapper'>
      <Form formType='login' value={values} onSubmit={onSubmit} handleChange={handleChange} />
    </div>
  );
};

export default Login;
