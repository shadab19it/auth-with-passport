import { Router } from "express";
import { isSignedIn, UserLogOut, UserLoign, UserSignUp } from "../controler/auth";
import { check } from "express-validator";
import passport from "passport";
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
  ],
  UserSignUp
);

/**
 * Login User with passport local
 */
router.post(
  "/login",
  [check("email", "Email is Required").isEmail(), check("password", "Password must at least 5+ char long").trim().isLength({ min: 5 })],
  passport.authenticate("local", { failureRedirect: "/api/user/login/failed", failureFlash: true }),
  UserLoign
);

router.get("/login/failed", (req, res) => {
  return res.status(400).json({ msg: req.flash("msg")[0] });
});

/**
 * Google login route with passport
 */

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/api/user/auth/google/fail" }), (req: any, res) => {
  return res.status(201).json({ msg: "Login Successfull", user: req.user });
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
 * LogOut route
 */

router.get("/logout", isSignedIn, UserLogOut);

export default router;
