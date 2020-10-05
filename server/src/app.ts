import dotenv from "dotenv";
import express, { Application, Request, Response } from "express";
import cors from "cors";
import passport from "passport";
import bodyParser from "body-parser";
import InitializePassport from "./Config/passportConfig";
import cookieParser from "cookie-parser";
import { myDB } from "./Config/dbConfig";
import { MysqlError } from "mysql";
import expressSession from "express-session";
import morgan from "morgan";
import flash from "express-flash";
dotenv.config();
const app: Application = express();

// my import Routes
import auth from "./routes/auth";

// Initialize Passport
InitializePassport(passport);

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

const sessionOpt = {
  secret: process.env.SECRET_SESSION,
  resave: false,
  saveUninitialized: true,
  rolling: true,
  name: "sid",
  cookie: {
    httpOnly: true,
    maxAge: 20 * 60 * 1000, // 20 minutes
  },
};

/**
 * Middleware
 */
app.use(cors());
app.use(flash());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(bodyParser.json({ type: "application/*+json" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(expressSession(sessionOpt));
app.use(passport.initialize());
app.use(passport.session());

/**
 * Use Routes
 */
app.get("/new", (req: any, res: Response) => {
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
