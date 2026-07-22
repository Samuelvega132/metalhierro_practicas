import { Request, Response } from "express";
import {
  AsignarEquipoDto,
  CreateEquipoDto,
  DevolverEquipoDto,
  EquipoIdParamDto,
  ListEquiposQueryDto
} from "./equipos.dto";
import { EquiposService } from "./equipos.service";

export class EquiposController {
  static async list(req: Request, res: Response): Promise<void> {
    const data = await EquiposService.list(
      req.query as unknown as ListEquiposQueryDto
    );
    res.status(200).json({ success: true, data });
  }

  static async create(req: Request, res: Response): Promise<void> {
    const data = await EquiposService.create(req.body as CreateEquipoDto);
    res.status(201).json({ success: true, data });
  }

  static async asignar(req: Request, res: Response): Promise<void> {
    const data = await EquiposService.asignar(req.body as AsignarEquipoDto);
    res.status(201).json({ success: true, data });
  }

  static async devolver(req: Request, res: Response): Promise<void> {
    const data = await EquiposService.devolver(req.body as DevolverEquipoDto);
    res.status(200).json({ success: true, data });
  }

  static async historial(req: Request, res: Response): Promise<void> {
    const params = req.params as unknown as EquipoIdParamDto;
    const data = await EquiposService.historial(params.id);
    res.status(200).json({ success: true, data });
  }
}
