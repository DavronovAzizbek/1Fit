import express, { Application } from "express";
import dotenv from "dotenv";
import router from "./routes";
import { ErrorHandlerMiddleware } from "@middlewares";
dotenv.config();
import "./config/passport";
import session from "express-session";
import passport from "passport";

const app: Application = express();

app.use(
  session({
    secret: "123456789",
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());

app.use("/api/v1", router);

app.use("/*", ErrorHandlerMiddleware.errorHandlerMiddleware);

let PORT = process.env.APP_PORT || 5000;
app.listen(PORT, () => {
  console.log(`The server is running on port ${PORT}`);
});
