import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { UsecaseResponse } from "../../../shared/util/response.adapter";
import { Result } from "../../../shared/util/result.contract";
import { Usecase } from "../../../shared/util/usecase.contract";
import { JobRepository } from "../repositories/job.repository";

export class ListJobsCandidates implements Usecase {
  public async execute(idRecruiter: string): Promise<Result> {
    const repository = new JobRepository();
    const cacheRepository = new CacheRepository();
    const cache = await cacheRepository.get(`jobs-${idRecruiter}`);

    if (cache) {
      return {
        ok: true,
        code: 200,
        message: "Jobs and their Cadidates successfully listed (Cache)",
        data: cache,
      };
    }

    const result = await repository.list(idRecruiter);

    if (!result) {
      return UsecaseResponse.notFound("Jobs");
    }

    await cacheRepository.set(`jobs-${idRecruiter}`, result);

    return {
      ok: true,
      code: 200,
      message: "Jobs and their Cadidates successfully listed",
      data: result,
    };
  }
}
