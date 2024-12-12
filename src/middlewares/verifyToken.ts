import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { verify } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
const prisma = new PrismaClient();

const secretKey = process.env.SECRET_KEY || "123456789";

const verifyToken = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.headers as { token?: string };

    if (!token) {
      return res.status(404).send({
        success: false,
        message: "Token not provided ❌",
      });
    }

    try {
      const decoded = verify(token, secretKey) as { id: number };
      const { id } = decoded;

      const user = await prisma.users.findUnique({
        where: {
          id,
        },
      });

      if (user) {
        req.user = id;
        return next();
      } else {
        return res.status(400).send({
          success: false,
          message: "Token Error ❌",
        });
      }
    } catch (error) {
      return res.status(400).send({
        success: false,
        message: "Invalid token 🚫",
      });
    }
  };
};

export { verifyToken };
