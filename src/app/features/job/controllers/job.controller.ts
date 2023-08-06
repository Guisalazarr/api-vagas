import { Request, Response } from "express";
import { CreateJobUsecase } from "../usecases/create-job.usecasse";
import { HttpResponse } from "../../../shared/util";
import { ListCandidatesJob } from "../usecases/list-candidates-job.usecase.";

export class JobController {
  public async create(req: Request, res: Response) {
    try {
      const { description, enterprise, limitDate, isActive, maxCandidates } =
        req.body;
      const idRecruiter = req.headers.loggedUserId;

      if (!description) {
        return HttpResponse.fieldNotProvided(res, "Description");
      }

      if (!enterprise) {
        return HttpResponse.fieldNotProvided(res, "enterprise");
      }

      if (!limitDate) {
        return HttpResponse.fieldNotProvided(res, "limitDate");
      }

      if (isActive === undefined) {
        return HttpResponse.fieldNotProvided(res, "isActive");
      }

      const result = await new CreateJobUsecase().execute({
        ...req.body,
        idRecruiter,
      });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }

  public async listByJob(req: Request, res: Response) {
    try {
      const { idJob } = req.params;
      const { loggedUserId } = req.headers;

      const usecase = new ListCandidatesJob();
      const result = await usecase.execute({
        idJob,
        idRecruiter: loggedUserId as string,
      });

      return res.status(result.code).send(result);
    } catch (error: any) {
      return res.status(500).send({
        ok: false,
        message: error.toString(),
      });
    }
  }
}
