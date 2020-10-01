import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth2";
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
          const inserSql = `INSERT INTO members SET ?`;
          myDB.query(inserSql, memberInfo, (err, result: mysqlRes) => {
            if (err) done(err);
            const user = {
              id: result.insertId,
            };
            return done(null, user);
          });
        });
      }
    )
  );

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
