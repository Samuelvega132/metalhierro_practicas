import { AuthTokenPayload } from "../utils/jwt.handle";

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export {};
