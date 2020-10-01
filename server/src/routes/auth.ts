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
 * Login User
 */
router.post(
  "/login",
  [check("email", "Email is Required").isEmail(), check("password", "Password must at least 5+ char long").trim().isLength({ min: 5 })],
  passport.authenticate("local", { failureRedirect: "/api/user/login/failed", failureFlash: true }),
  UserLoign
);

router.get("/login/failed", (req, res) => {
  res.json({ error: req.flash("msg")[0] });
});

router.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

router.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/api/user/auth/google/fail" }), (req: any, res) => {
  res.json({ msg: "Login Successfull", User: req.user });
});

router.get("/auth/google/fail", (req, res) => {
  res.json("Error");
});

router.get("/logout", isSignedIn, UserLogOut);

export default router;
