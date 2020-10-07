import { Request, Response } from "express";
import dotenv from "dotenv";
import { myDB } from "../Config/dbConfig";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRes } from "../Config/passportConfig";
import nodemailer, { SentMessageInfo } from "nodemailer";
dotenv.config();

interface User {
  username: string;
  email: string;
  password: string;
  password2: string;
  profile_image_path: string;
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

export const findUserById = (id: number) => {
  return new Promise((resolve, reject) => {
    const sql = `select * from members where id = ${id}`;
    myDB.query(sql, (err, existUser: IUserRes[]) => {
      if (err) reject(err);
      if (existUser[0]) {
        existUser[0].hasHpassword = undefined;
        resolve(existUser[0]);
      } else {
        reject(false);
      }
    });
  });
};

export const UserSignUp = async (req: Request, res: Response) => {
  // ========= Request body field Check Error ==========//
  const error = validationResult(req);
  if (!error.isEmpty()) {
    return res.status(401).json({ msg: error.array()[0].msg });
  }
  // ========= Check User Already Register ==========//
  const getSql = `select * from members where email = ?`;
  myDB.query(getSql, [req.body.email], async (err, existUser: IUserRes[]) => {
    if (err) return res.status(401).json({ msg: "Someting wrong with mySql" });

    if (existUser.length > 0) {
      return res.status(401).json({ msg: "Email Already exist" });
    }
    // ========= Check password and password are matched ==========//
    const { username, email, password, profile_image_path, password2 } = req.body as User;
    if (!(password === password2)) {
      return res.status(401).json({ msg: "Confirm Password does not matched." });
    }

    const token = jwt.sign({ username, password, email }, process.env.JWT_CONFIRM_EMAIL_KEY, { expiresIn: "30m" });
    const CLIENT_URL = "http://" + req.headers.host;

    const output = `
    <h2>Please click on below link to activate your account</h2>
    <p>${CLIENT_URL}/api/user/email/activate/${token}</p>
    <a href='${CLIENT_URL}/api/user/email/activate/${token}'>Clicl here to Activate Link<a>
    <p><b>NOTE: </b> The above activation link expires in 30 minutes.</p>`;

    const transpoter = nodemailer.createTransport({
      service: "hotmail",
      auth: {
        user: "shadab33_44_55@hotmail.com",
        pass: "kightangle123",
      },
    });
    // ========= default vlaues of sending mail ==========//
    const mailOprion = {
      from: '"Auth Admin" <shadab33_44_55@hotmail.com>',
      to: email,
      subject: "Account Verification: NodeJS Auth ✔",
      html: output,
    };

    transpoter.sendMail(mailOprion, (err, info: SentMessageInfo) => {
      if (err) {
        console.log(err);

        return res.status(401).json({ msg: "Something went wrong on our end. Please register again." });
      } else {
        console.log('"mail sent : " %s', info.responce);
        return res.status(201).json({ msg: "Activation link sent to email ID. Please activate to log in." });
      }
    });
  });
};

// export const UserLogOut = (req: Request, res: Response) => {
//   req.logOut();
//   res.clearCookie("connect.sid");
//   return res.status(201).json({ msg: "User logout" });
// };

// export const isSignedIn = (req: Request, res: Response, next) => {
//   if (req.isAuthenticated()) {
//     return next();
//   }
//   return res.status(400).json({ msg: "ACCESS_DENIED" });
// };
