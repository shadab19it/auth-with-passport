import { Box, Button, Grid, TextField, Theme } from "@material-ui/core";
import React, { FC } from "react";
import "./Form.scss";
import GIcon from "../../assest/icons/gIcon.png";
import FIcon from "../../assest/icons/f.webp";
import { State } from "../../pages/Login/Login";
import { useHistory } from "react-router-dom";
import { Authenticate, FacebookLogin, GoogleLogin } from "../../services/AuthService";
interface IProps {
  handleChange: (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: any) => void;
  formType?: string;
  value: State;
}

const Form: FC<IProps> = ({ formType, onSubmit, handleChange, value }) => {
  const history = useHistory();

  const onGoogleLogin = () => {
    // GoogleLogin((r:any) => {
    //   Authenticate(r, () => {
    //     history.push("/");
    //   });
    // });
  };
  const onFacebookLogin = () => {
    // FacebookLogin((r) => {
    //   Authenticate(r, () => {
    //     history.push("/");
    //   });
    // });
  };
  return (
    <div className='form-wrapper'>
      <Box className='form-container' p={1}>
        {formType === "login" ? <h2>Login</h2> : <h2>Sign Up</h2>}
        <div className='input-boxes'>
          {formType !== "login" && (
            <div className='input-box'>
              <TextField id='outlined-basic1' label='Name' value={value.username} variant='outlined' onChange={handleChange("username")} />
            </div>
          )}

          <div className='input-box'>
            <TextField
              id='outlined-basic'
              type='email'
              value={value.email}
              label='Email'
              variant='outlined'
              onChange={handleChange("email")}
            />
          </div>
          <div className='input-box'>
            <TextField
              id='outlined-password-input'
              label='Password'
              type='password'
              value={value.password}
              autoComplete='current-password'
              variant='outlined'
              onChange={handleChange("password")}
            />
          </div>
          {formType === "signup" && (
            <div className='input-box'>
              <TextField
                id='outlined-password-input2'
                label='Confirm Password'
                type='password'
                value={value.password2}
                autoComplete='current-password'
                variant='outlined'
                onChange={handleChange("password2")}
              />
            </div>
          )}
          <div className='input-box'>
            <Button variant='contained' color='primary' style={{ width: "100%", height: "40px", marginTop: "20px" }} onClick={onSubmit}>
              Submit
            </Button>
          </div>
        </div>
        <div className='divider'>
          <div className='left-d'></div>
          <div className='or'>Or</div>
          <div className='right-d'></div>
        </div>
        <Grid container className='social-icons' wrap='wrap' justify='space-around'>
          <Grid item xs={5} className='g-icon' onClick={onGoogleLogin}>
            <img src={GIcon} alt='' />
            <h3>Google</h3>
          </Grid>
          <Grid item xs={5} className='f-icon' onClick={onFacebookLogin}>
            <img src={FIcon} alt='' />
            <h3>facebook</h3>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
};

export default Form;
