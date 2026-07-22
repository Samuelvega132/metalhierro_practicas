import { Request, Response } from "express";
import { TransaccionSuministroDto } from "./suministros.dto";
import { SuministrosService } from "./suministros.service";

export class SuministrosController {
  static async list(_req: Request, res: Response): Promise<void> {
    const data = await SuministrosService.list();
    res.status(200).json({ success: true, data });
  }

  static async registrarTransaccion(req: Request, res: Response): Promise<void> {
    const data = await SuministrosService.registrarTransaccion(
      req.body as TransaccionSuministroDto
    );
    res.status(201).json({ success: true, data });
  }
}
