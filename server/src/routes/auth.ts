import { Router } from "express";
import dotenv from "dotenv";
import { EmailActivation, mysqlRes, UserSignUp } from "../controler/auth";
import { check, Result, validationResult } from "express-validator";
import passport from "passport";
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

/**
 * Email Confirm Callback
 */
router.get("/email/activate/:token", EmailActivation);

/**
 * LogOut route
 */

// router.get("/test", (req, res) => {
//   console.log(req);
//   res.json(req);
// });

// router.get("/logout", UserLogOut);

export default router;
