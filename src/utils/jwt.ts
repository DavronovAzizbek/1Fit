import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

interface Payload {
  [key: string]: any;
}

const sign = (payload: Payload): string => {
  return jwt.sign(payload, "123456789" as jwt.Secret);
};

const verify = (token: string): Payload | null => {
  try {
    return jwt.verify(token, "123456789" as jwt.Secret) as Payload;
  } catch (error) {
    return null;
  }
};

export { sign, verify };
