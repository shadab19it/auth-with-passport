import { Strategy as LocalStrategy } from "passport-local";
import { myDB } from "./dbConfig";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

export interface IUserRes {
  id: number;
  username: string;
  email: string;
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
  passport.serializeUser((user: IUserRes, done) => {
    done(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    const sql = `select * from members where id = ${id}`;
    myDB.query(sql, (err, existUser: IUserRes) => {
      if (err) done(err);
      return done(null, existUser[0]);
    });
  });
};

export default InitializePassport;
