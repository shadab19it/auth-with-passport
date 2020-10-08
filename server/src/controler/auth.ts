import { Request, Response } from "express";
import dotenv from "dotenv";
import { myDB } from "../Config/dbConfig";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { IUserRes } from "../Config/passportConfig";
import nodemailer, { SentMessageInfo } from "nodemailer";
import passport from "passport";
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

export const findUserById = (field: number | string) => {
  return new Promise((resolve, reject) => {
    const sql = `select * from members where id = ${field} or email = ${field} `;
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
    return res.status(203).json({ msg: error.array()[0].msg });
  }
  // ========= Check User Already Register ==========//
  const getSql = `select * from members where email = ?`;
  myDB.query(getSql, [req.body.email], async (err, existUser: IUserRes[]) => {
    if (err) return res.status(400).json({ error: "Someting wrong with mySql" });

    if (existUser.length > 0) {
      return res.status(203).json({ msg: "Email is Already Register" });
    }
    // ========= Check password and password2 are matched ==========//
    const { username, email, password, profile_image_path, password2 } = req.body as User;
    if (!(password === password2)) {
      return res.status(203).json({ msg: "Confirm Password does not matched." });
    }

    const token = jwt.sign({ username, password, email }, process.env.JWT_CONFIRM_EMAIL_KEY, { expiresIn: "30m" });
    const CLIENT_URL = req.headers.referer;

    const output = `
    <h2>Please click on below link to activate your account</h2>
    <p>${CLIENT_URL}/email/activate/${token}</p>
    <a href='${CLIENT_URL}/email/activate/${token}'>Clicl here to Activate Link<a>
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
        return res.status(400).json({ error: "Something went wrong on our end. Please register again." });
      } else {
        console.log('"mail sent : " %s', info.responce);
        return res.status(202).json({ msg: `Activation link sent to email ID " ${email} ". Please activate for log in.` });
      }
    });
  });
};

export const EmailActivation = (req: Request, res: Response) => {
  const token = req.params.token;
  jwt.verify(token, process.env.JWT_CONFIRM_EMAIL_KEY, async (err, decodeToken) => {
    console.log("decode ", decodeToken);
    if (decodeToken === undefined) {
      return res.status(201).json({ msg: "Your Email Confirm Link Now Expire , Please SignUp Again " });
    }
    const { username, email, password } = decodeToken as any;

    //========= Check Allready Confirm Email ==========//
    try {
      const user = await findUserById(email);
      if (user) {
        return res.status(202).json({ msg: "Your Email is Already Confirmed , You can now Login" });
      }
    } catch (err) {
      return res.status(400).json({ error: "Someting Wrong to Check User ", err });
    }
    //========= Hashing The Password ==========//
    let hasHpassword;
    let saltRound = 10;
    try {
      const salt = bcrypt.genSaltSync(saltRound);
      hasHpassword = await bcrypt.hashSync(password, salt);
    } catch (err) {
      return res.status(401).json({ msg: "Something worng with password" });
    }
    const newMember = {
      username,
      email,
      hasHpassword,
      profile_image_path: "",
    };
    const sql = `INSERT INTO members SET ?`;
    myDB.query(sql, newMember, (err, result: mysqlRes) => {
      if (err) {
        return res.status(401).json({ msg: "You are not sign up" });
      }
      return res.status(201).json({ msg: "Your Email is Confirmed", email: email });
    });
  });
};

/**
 * Logout Method
 */

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

export const checkAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(401).json({ msg: "you are not loged In" });
    }
    return next();
  })(req, res, next);
};
