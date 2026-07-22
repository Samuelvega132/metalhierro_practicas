import { Request, Response } from "express";
import { AppError } from "../../utils/app-error";
import { LoginDto } from "./auth.dto";
import { AuthService } from "./auth.service";

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    const result = await AuthService.login(req.body as LoginDto);
    res.status(200).json({
      success: true,
      data: result
    });
  }

  static async me(req: Request, res: Response): Promise<void> {
    if (!req.user) {
      throw new AppError("Usuario no autenticado.", 401);
    }

    const user = await AuthService.getMe(req.user.usr_id);
    res.status(200).json({
      success: true,
      data: user
    });
  }
}
