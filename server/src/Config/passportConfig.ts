import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { myDB } from "./dbConfig";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import dotenv from "dotenv";
import { mysqlRes } from "../controler/auth";
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
    new LocalStrategy({ usernameField: "email", passwordField: "password", passReqToCallback: true }, (req, email, password, done) => {
      const error = validationResult(req);
      if (!error.isEmpty()) {
        return done(null, false, req.flash("msg", `${error.array()[0].msg}`));
      }
      const sql = `SELECT * FROM members WHERE email = ?`;
      myDB.query(sql, [email], async (err, result: IUserRes[]) => {
        if (err) {
          return done(err, false, req.flash("msg", `SomeThing wents wrong`));
        }

        if (result.length === 0) {
          return done(null, false, req.flash("msg", `User Invalied`));
        }

        try {
          if (await bcrypt.compare(password, result[0].hasHpassword)) {
            return done(null, result[0]);
          }
          return done(null, false, req.flash("msg", `Password does not matched`));
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
   * serialize and deserialize User
   */

  passport.serializeUser((user: IUserRes, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const sql = `select * from members where id = ${id}`;
    myDB.query(sql, (err, existUser: IUserRes[]) => {
      if (err) done(err);
      return done(null, existUser[0]);
    });
  });
};

export default InitializePassport;
