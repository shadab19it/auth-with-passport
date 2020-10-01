import { Request, Response } from "express";
import { myDB } from "../Config/dbConfig";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import { nextTick } from "process";

interface User {
  name: string;
  email: string;
  password: string;
}
export interface mysqlRes {
  fiedldCount: number;
  affectedRows: number;
  insertId: number;
  serverStatus: number;
  warningCount: number;
  message: string;
  protocol141: boolean;
  changedRows: number;
}

export const UserLoign = async (req: Request, res: Response) => {
  return res.status(201).json({ user: req.user, isSingIn: req.isAuthenticated() });
};

export const UserSignUp = async (req: Request, res: Response) => {
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(401).json({ error: error.array()[0].msg });
  }
  const { username, email, password, profile_image_path } = req.body;
  let hasHpassword;
  try {
    hasHpassword = await bcrypt.hash(password, 10);
  } catch (err) {
    return res.status(401).json({ error: "Something worng with password" });
  }
  const memberInfo = {
    username,
    email,
    hasHpassword,
    profile_image_path,
  };
  const sql = `INSERT INTO members SET ?`;
  myDB.query(sql, memberInfo, (err, result: mysqlRes) => {
    if (err) {
      return res.status(401).json({ error: "user not not sign up", err: err });
    }
    return res.status(201).json({ msg: "User SignUp successfully !", userId: result.insertId });
  });
};

export const UserLogOut = (req: Request, res: Response) => {
  req.logOut();
  res.clearCookie("connect.sid");
  return res.json({ msg: "User logout", isSignIn: req.isAuthenticated() });
};

export const isSignedIn = (req: Request, res: Response, next) => {
  if (req.isAuthenticated()) {
    next();
  }
  return res.status(500).json({ msg: "ACCESS_DENIED" });
};
