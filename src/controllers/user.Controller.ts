import { PrismaClient, Users } from "@prisma/client";
import { sign, verify } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
import passport from "passport";
import dotenv from "dotenv";
dotenv.config();

let client = new PrismaClient();

const secretKey = process.env.SECRET_KEY || "123456789";

export class UserController {
  static async LoginGithub(req: Request, res: Response, next: NextFunction) {
    try {
      passport.authenticate("github", {
        scope: ["user:email"],
      })(req, res);
    } catch (error) {
      next(error);
    }
  }

  static async CallbackGithub(req: Request, res: Response, next: NextFunction) {
    try {
      let { id, _json } = req.user as any;
      let [checkUser] = await client.users.findMany({
        where: {
          user_platform_id: Number(id),
        },
      });

      if (checkUser) {
        let access_token = sign({ id: checkUser.id }, secretKey, {
          expiresIn: "1h",
        });
        let refresh_token = sign({ id: checkUser.id }, secretKey, {
          expiresIn: "7d",
        });

        res.send({
          success: true,
          message: "You Have Successfully Logged In ✅",
          data: {
            access_token,
            refresh_token,
          },
        });
      } else {
        let user = await client.users.create({
          data: {
            user_platform_id: _json.id,
            firstName: _json.name,
            email: _json.email,
          },
        });

        let access_token = sign({ id: user.id }, secretKey, {
          expiresIn: "1h",
        });
        let refresh_token = sign({ id: user.id }, secretKey, {
          expiresIn: "7d",
        });

        res.send({
          success: true,
          message: "You Have Successfully Registered ✅",
          data: {
            access_token,
            refresh_token,
          },
        });
      }
    } catch (error: any) {
      res.status(error.status || 400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async getAllGithub(req: Request, res: Response, next: NextFunction) {
    try {
      let user = await client.users.findMany();
      res.send({
        success: true,
        message: user,
      });
    } catch (error: any) {
      res.status(error.status || 400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async Admin(req: Request, res: Response, next: NextFunction) {
    try {
      let { user_platform_id, firstName, email, isAdmin }: Omit<Users, "id"> =
        req.body;
      let admin: Users = await client.users.create({
        data: {
          user_platform_id,
          firstName,
          email,
          isAdmin: true,
        },
      });
      res.status(200).send({
        success: true,
        message: "Admin Created Successfully ✅",
        data: admin,
      });
    } catch (error: any) {
      res.status(error.status || 400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async adminLogin(req: Request, res: Response, next: NextFunction) {
    try {
      let [admin]: Users[] = await client.users.findMany({
        where: { firstName: req.body.firstName },
      });
      if (admin) {
        let token = sign({ id: admin.id }, secretKey, { expiresIn: "1h" });
        res.status(200).send({
          success: true,
          message: "Admin Login Successful ✅",
          data: {
            access_token: token,
          },
        });
      } else {
        res.send({
          success: false,
          message: "Admin Not Found ❌",
        });
      }
    } catch (error: any) {
      res.status(error.status || 400).send({
        success: false,
        message: error.message,
      });
    }
  }

  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      let { access_token } = req.headers;

      const data: any = verify(access_token as string, secretKey as string);

      const user = await client.users.findUnique({
        where: {
          id: data.id,
        },
      });

      res.status(200).send({
        success: true,
        message: "Your profile",
        data: user,
      });
    } catch (error) {
      res.send("error");
    }
  }
}
