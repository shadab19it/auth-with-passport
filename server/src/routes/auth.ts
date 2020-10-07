import { Router } from "express";
import dotenv from "dotenv";
import { mysqlRes, UserSignUp } from "../controler/auth";
import { check, Result, validationResult } from "express-validator";
import passport from "passport";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { myDB } from "../Config/dbConfig";
dotenv.config();
const router = Router();
/**
 * SignUp User
 */
router.post(
  "/signup",
  [
    check("username", "Name must be at least 5 char long").isLength({ min: 5 }).trim(),
    check("email", "Email is Required").isEmail(),
    check("password", "Password must at least 5+ char long").trim().isLength({ min: 5 }),
    check("password2", "Please Enter Confirm Password").trim().isLength({ min: 5 }),
  ],
  UserSignUp
);

/**
 * Login User with passport local
 */
router.post(
  "/login",
  [check("email", "Email is Required").isEmail(), check("password", "Password must at least 5+ char long").trim().isLength({ min: 5 })],
  (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(401).json({ msg: error.array()[0].msg });
    }
    passport.authenticate("local", { session: false }, (err, user, info) => {
      if (!info) {
        return res.status(201).json({ profile: { user: user.user, token: user.token }, msg: "You are successfull login" });
      }
      return res.status(401).json({ msg: info.message });
    })(req, res, next);
  }
);

/**
 * Google login route with passport
 */

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/api/user/auth/google/fail" }), (req: any, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  return res.status(201).json({ user: req.user });
});

router.get("/auth/google/fail", (req, res) => {
  return res.status(400).json({ error: "You are not login , Somting wents wrong" });
});

/**
 * Facewbook login route with passport
 */
router.get("/auth/facebook", passport.authenticate("facebook"));

router.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/api/user/auth/facebook" }), (req, res) => {
  return res.status(201).json({ msg: "Login Successfull", user: req.user });
});
router.get("/email/activate/:token", (req, res) => {
  const token = req.params.token;
  jwt.verify(token, process.env.JWT_CONFIRM_EMAIL_KEY, async (err, decodeToken) => {
    console.log("decode ", decodeToken);
    const { username, email, password } = decodeToken as any;
    //========= Hashing The Password ==========//
    let hasHpassword;
    try {
      hasHpassword = await bcrypt.hash(password, 10);
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
        return res.status(401).json({ msg: "user not not sign up" });
      }
      res.redirect("http://localhost:3000/login");
    });
  });
});

export const checkAuth = (req, res, next) => {
  passport.authenticate("jwt", { session: false }, (err, user, info) => {
    if (!user) {
      return res.status(401).json({ msg: "you are not loged In" });
    }
    return next();
  })(req, res, next);
};

/**
 * LogOut route
 */

// router.get("/logout", UserLogOut);

export default router;
