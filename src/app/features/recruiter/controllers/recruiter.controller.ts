import { Request, Response } from "express";
import { CreateRecruiterUsecase } from "../usecases/create-recruiter.usecase";
import { HttpResponse } from "../../../shared/util";
import { ListRecruitersUsecase } from "../usecases/list-recruiters.usecase";

export class RecruiterController {
  public async create(req: Request, res: Response) {
    try {
      // 1 - parametros
      const { email, name, password, enterpriseName } = req.body;
      if (!email) {
        return HttpResponse.fieldNotProvided(res, "Email");
      }

      // 2 - processamento
      const result = await new CreateRecruiterUsecase().execute(req.body);

      // 3 - resposta
      return res.status(result.code).send(result);
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async list(req: Request, res: Response) {
    try {
      // 2 - processamento
      const result = await new ListRecruitersUsecase().execute();

      // 3 - resposta
      return res.status(result.code).send(result);
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }
}
