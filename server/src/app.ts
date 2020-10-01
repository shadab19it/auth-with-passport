import dotenv from "dotenv";
dotenv.config();
import express, { Application, Request, Response } from "express";
const app: Application = express();
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
import InitializePassport from "./Config/passportConfig";
import { myDB } from "./Config/dbConfig";
import { MysqlError } from "mysql";
import expressSession from "express-session";
import flash from "express-flash";

// my import Routes
import auth from "./routes/auth";

/**
 * DB Connection
 */
myDB.connect((err: MysqlError) => {
  if (err) {
    console.log("DB not Connected !", err.sqlMessage);
  } else {
    console.log("DB Connected Successfully");
  }
});

/**
 * Middleware
 */
app.use(cors());
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(express.json());
app.use(expressSession({ secret: process.env.SECRET_SESSION, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

// Initialize Passport
InitializePassport(passport);

/**
 * Use Routes
 */
app.get("/", (req: any, res: Response) => {
  res.json({ body: "hello", isSignIn: req.isAuthenticated(), username: req.user ? req.user.username : "" });
});
app.use("/api/user", auth);

/**
 * Start Server
 */

const PORT: number | string = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server Start with Port ${PORT} >> http://localhost:${PORT}/`);
});
