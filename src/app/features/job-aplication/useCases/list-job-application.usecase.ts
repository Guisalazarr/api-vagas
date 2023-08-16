import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Result } from "../../../shared/util";
import { Usecase } from "../../../shared/util/usecase.contract";
import { JobApplicationRepository } from "../repositories/job-application.repository";

export class ListJobsApplication implements Usecase {
  public async execute(idCandidate: string): Promise<Result> {
    const cacheRepository = new CacheRepository();
    const cacheResult = await cacheRepository.get(`jobs-${idCandidate}`);

    if (cacheResult) {
      return {
        ok: true,
        code: 200,
        message: "Jobs from the Job application successfully listed",
        data: cacheResult,
      };
    }

    const repository = new JobApplicationRepository();
    const result = await repository.listByCandidateId(idCandidate);

    const data = result?.map((job) => job?.job.toJson());
    await cacheRepository.set(`jobs-${idCandidate}`, data);

    return {
      ok: true,
      code: 200,
      message: "Jobs application successfully listed",
      data,
    };
  }
}
