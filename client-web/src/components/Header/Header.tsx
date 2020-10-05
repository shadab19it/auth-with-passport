import { Avatar, IconButton } from "@material-ui/core";
import React, { FC } from "react";
import "./Header.scss";
import { useHistory, useLocation } from "react-router-dom";
import { isAuthenticated, UserLogOut } from "../../services/AuthService";

const Header: FC = () => {
  const location = useLocation();
  const history = useHistory();

  const { user } = isAuthenticated();

  const ActiveLink = (l: string) => {
    if (location.pathname == l) {
      return "active-link";
    }
  };

  return (
    <div className='header-wrapper'>
      <div className='left-h-content'>
        <div className='user-profile'>
          <div className='user-img'>
            <IconButton>
              <Avatar alt='Shadab Alam' src='' />
            </IconButton>
          </div>
          <div className='user-name'>
            <h3>Shadab Alam</h3>
          </div>
        </div>
      </div>
      <div className='right-h-content'>
        <ul className='nav-menu'>
          <li className={`menu-link ${ActiveLink("/")}`} onClick={() => history.push("/")}>
            Home
          </li>
          {!user && (
            <>
              <li className={`menu-link ${ActiveLink("/login")} `} onClick={() => history.push("/login")}>
                Login
              </li>
              <li className={`menu-link ${ActiveLink("/signup")}`} onClick={() => history.push("/signup")}>
                Sign Up
              </li>
            </>
          )}

          {user && (
            <li className={`menu-link ${ActiveLink("/logout")}`} onClick={() => UserLogOut(() => history.push("/"))}>
              LogOut
            </li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default Header;
