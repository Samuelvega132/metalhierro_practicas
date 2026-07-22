import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {
  static async metrics(req: Request, res: Response): Promise<void> {
    const empresaId =
      typeof req.query.empresaId === "number" ? req.query.empresaId : undefined;

    const data = await DashboardService.getMetrics(empresaId);
    res.status(200).json({ success: true, data });
  }
}
