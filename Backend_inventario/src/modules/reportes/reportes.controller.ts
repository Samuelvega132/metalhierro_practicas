import { Request, Response } from "express";
import {
  InventarioGeneralQueryDto,
  LicenciasVencimientoQueryDto,
  MovimientosSuministrosQueryDto
} from "./reportes.dto";
import { ReportesService } from "./reportes.service";

export class ReportesController {
  static async inventarioGeneral(req: Request, res: Response): Promise<void> {
    const data = await ReportesService.inventarioGeneral(
      req.query as unknown as InventarioGeneralQueryDto
    );
    res.status(200).json({ success: true, data });
  }

  static async licenciasVencimiento(req: Request, res: Response): Promise<void> {
    const data = await ReportesService.licenciasVencimiento(
      req.query as unknown as LicenciasVencimientoQueryDto
    );
    res.status(200).json({ success: true, data });
  }

  static async movimientosSuministros(req: Request, res: Response): Promise<void> {
    const data = await ReportesService.movimientosSuministros(
      req.query as unknown as MovimientosSuministrosQueryDto
    );
    res.status(200).json({ success: true, data });
  }
}
