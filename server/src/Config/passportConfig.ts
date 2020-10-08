import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import jwt from "jsonwebtoken";
import { Strategy as JWTStrategy, ExtractJwt } from "passport-jwt";
import { myDB } from "./dbConfig";
import { findUserById, mysqlRes } from "../controler/auth";
import bcrypt from "bcrypt";

import dotenv from "dotenv";
dotenv.config();

export interface IUserRes {
  id: number;
  username: string;
  email: string;
  google_id: string;
  hasHpassword: string;
  profile_image_path: string;
}

const InitializePassport = (passport: any) => {
  /**
   * Local Login
   */
  passport.use(
    new LocalStrategy({ usernameField: "email", passwordField: "password", session: false }, async (email, password, done) => {
      const sql = `SELECT * FROM members WHERE email = ?`;
      myDB.query(sql, [email], async (err, result: IUserRes[]) => {
        if (err) {
          return done(err, false, { message: "Something wents wrong" });
        }
        if (result.length === 0) {
          return done(null, false, { message: "You are not register " });
        }
        try {
          if (await bcrypt.compareSync(password, result[0].hasHpassword)) {
            result[0].hasHpassword = undefined;
            const { id, username, email } = result[0];
            const token = jwt.sign({ id, username, email }, process.env.JWT_SECRET_KEY);
            const profile = {
              user: result[0],
              token,
            };
            return done(null, profile);
          }
          return done(null, false, { message: "Password does not matched" });
        } catch (err) {
          done(err);
        }
      });
    })
  );

  /**
   * Google login
   */
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:9000/api/user/auth/google/callback",
        passReqToCallback: true,
      },
      (req, accessToken, refreshToken, profile, done) => {
        const sql = `SELECT * FROM members WHERE google_id = ${profile.id}`;
        myDB.query(sql, (err, existUser: IUserRes[]) => {
          if (err) done(err);
          if (existUser.length > 0) {
            return done(null, existUser[0]);
          }
          const memberInfo = {
            google_id: profile.id,
            username: profile._json.given_name + " " + profile._json.family_name,
            email: profile._json.email,
            profile_image_path: profile._json.picture,
          };
          const insertSql = `INSERT INTO members SET ?`;
          myDB.query(insertSql, memberInfo, (err, result: mysqlRes) => {
            if (err) done(err);
            const userId = {
              id: result.insertId,
            };
            return done(null, userId);
          });
        });
      }
    )
  );

  /**
   * Facewbook login
   */

  passport.use(
    new FacebookStrategy(
      {
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:9000/api/user/auth/facebook/callback",
        profileFields: ["id", "displayName", "photos", "email"],
      },
      (accessToken, refreshToken, profile, done) => {
        const sql = `SELECT * FROM members WHERE google_id = ${profile.id}`;
        myDB.query(sql, (err, existUser: IUserRes[]) => {
          if (err) done(err);
          if (existUser.length > 0) {
            return done(null, existUser[0]);
          }
          const memberInfo = {
            google_id: profile.id,
            username: profile.displayName,
            email: profile._json.email || "",
            profile_image_path: profile.photos[0].value,
          };
          const insertSql = `INSERT INTO members SET ?`;
          myDB.query(insertSql, memberInfo, (err, result: mysqlRes) => {
            if (err) done(err);
            const userId = {
              id: result.insertId,
            };
            return done(null, userId);
          });
        });
      }
    )
  );

  /**
   * Authentication Checker
   */
  passport.use(
    "jwt",
    new JWTStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: process.env.JWT_SECRET_KEY,
        // algorithms:['rs256']
      },
      async (jwtPayload, done) => {
        try {
          const user = await findUserById(jwtPayload.id);
          if (!user) {
            return done(null, false);
          }
          return done(null, user);
        } catch (err) {
          return done(err);
        }
      }
    )
  );

  /**
   * serialize and deserialize User
   */

  // passport.serializeUser((user: IUserRes, done) => {
  //   done(null, user.id);
  // });

  // passport.deserializeUser((id, done) => {
  //   const sql = `select * from members where id = ${id}`;
  //   myDB.query(sql, (err, existUser: IUserRes[]) => {
  //     if (err) done(err);
  //     existUser[0].hasHpassword = undefined;
  //     done(null, existUser[0]);
  //   });
  // });
};

export default InitializePassport;
