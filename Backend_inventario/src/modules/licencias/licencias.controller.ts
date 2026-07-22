import { Request, Response } from "express";
import { AsignarLicenciaEquipoDto } from "./licencias.dto";
import { LicenciasService } from "./licencias.service";

export class LicenciasController {
  static async list(_req: Request, res: Response): Promise<void> {
    const data = await LicenciasService.list();
    res.status(200).json({ success: true, data });
  }

  static async asignarEquipo(req: Request, res: Response): Promise<void> {
    const data = await LicenciasService.asignarEquipo(
      req.body as AsignarLicenciaEquipoDto
    );
    res.status(201).json({ success: true, data });
  }
}
