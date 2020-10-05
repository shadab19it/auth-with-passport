import { API } from "../BackedApi/BackendApi";
import { State } from "../pages/Login/Login";
import Cookies from "universal-cookie";
const cookie = new Cookies();

export const setCookie = (name: string, value: any) => {
  cookie.set(name, JSON.stringify(value), { domain: window.location.hostname, maxAge: 99999 });
};

export interface IUserRes {
  id: number;
  username: string;
  email: string;
  google_id: string;
  profile_image_path: string;
}

export interface ResMsg {
  msg: string;
}

export const AuthSignUp = async (value: State, onSuccess: (r: ResMsg) => void) => {
  try {
    const res = await fetch(`${API}/user/signup`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
    if (res.status === 201 && res.body) {
      const r = (await res.json()) as ResMsg;
      onSuccess(r);
    } else if (res.status === 401 && res.body) {
      const r = await res.json();
      console.log("Unautherised Erroe " + r.error);
    }
  } catch (err) {
    console.log(err);
  }
};

export const AuthLogin = async (value: State, onSuccess: (r: IUserRes) => void) => {
  try {
    const res = await fetch(`${API}/user/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(value),
    });
    if (res.status === 201 && res.body) {
      const r = (await res.json()) as IUserRes;
      onSuccess(r);
    } else if (res.status === 401 && res.body) {
      const r = await res.json();
      console.log("Unautherised Erroe " + JSON.stringify(r));
    } else if (res.status === 400 && res.body) {
      const r = (await res.json()) as ResMsg;
      console.log("backend msg " + JSON.stringify(r));
    } else {
      console.log("notting");
    }
  } catch (err) {
    console.log(err);
  }
};

export const GoogleLogin = async (onSuccess: (r: IUserRes) => void) => {
  try {
    const res = await fetch(`${API}/user/auth/google`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
      },
    });
    if (res.status === 201 && res.body) {
      const r = (await res.json()) as IUserRes;
      onSuccess(r);
    } else if (res.status === 401 && res.body) {
      const r = await res.json();
      console.log("Unautherised Erroe " + r.error);
    } else if (res.status === 400 && res.body) {
      const r = await res.json();
      console.log("backend msg " + JSON.stringify(r));
    } else {
      console.log("notting " + JSON.stringify(res));
    }
  } catch (err) {
    console.log(err);
  }
};

export const FacebookLogin = async (onSuccess: (r: IUserRes) => void) => {
  try {
    const res = await fetch(`${API}/user/auth/facebook`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });
    if (res.status === 201 && res.body) {
      const r = (await res.json()) as IUserRes;
      onSuccess(r);
    } else if (res.status === 401 && res.body) {
      const r = await res.json();
      console.log("Unautherised Erroe " + r.error);
    } else if (res.status === 400 && res.body) {
      const r = await res.json();
      console.log("backend msg " + JSON.stringify(r));
    } else {
      console.log("notting " + JSON.stringify(res));
    }
  } catch (err) {
    console.log(err);
  }
};

export const test = async () => {
  console.log("test run");
  try {
    const res = await fetch(`http://localhost:9000/new`, {
      method: "GET",
    });
    const r = (await res.json()) as any;
    console.log("rere " + JSON.stringify(r));
  } catch (err) {
    console.log(err);
  }
};

export const UserLogOut = async (next: any) => {
  if (typeof window !== undefined) {
    cookie.remove("user", { path: "/" });
  }
  next();
  try {
    const res = await fetch(`${API}/user/logout`, {
      method: "GET",
    });
    if (res.status === 201 && res.body) {
      const r = (await res.json()) as ResMsg;
      console.log(r.msg);
    } else if (res.body) {
      const r = await res.json();
      console.log("Unautherised Erroe " + r.msg);
    }
  } catch (err) {
    console.log(err);
  }
};

export const Authenticate = (user: IUserRes, next: any) => {
  if (document.cookie !== undefined) {
    setCookie("user", user);
  }
  next();
};

export const isAuthenticated = () => {
  if (document.cookie === undefined) {
    return false;
  }
  if (cookie.get("user")) {
    return cookie.get("user");
  }
  return false;
};
