import { ErrorHandler } from "@errors";
import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv"
import { PrismaClient } from "@prisma/client";
dotenv.config();

const client = new PrismaClient();

export const VerifyRole = (role: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
      try {
        const { access_token } = req.headers;
  
        if (!access_token) {
          return res.status(401).send({
            success: false,
            message: "No token provided",
          });
        }
  
        const data: any = verify(access_token as string, process.env.SECRET_KEY as string);
  
        const user = await client.users.findUnique({
            where: {
                id: data.id
            }
        });
        
        if (user?.isAdmin) {
          next();
        } else {
          return res.status(403).send({
            success: false,
            message: "You have no access",
          });
        }
      } catch (error: any) {
        next(new ErrorHandler(error.message, error.status || 500));
      }
    };
  };