import { UserType } from "../../../models/user-type.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Result } from "../../../shared/util";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";

export class ListCandidateUsecase implements Usecase {
  public async execute(): Promise<Result> {
    const repository = new UserRepository();
    const cacheRepository = new CacheRepository();

    // BANCO NÃO RELACIONAL - REDIS
    const cacheResult = await cacheRepository.get("candidates");

    if (cacheResult) {
      return {
        ok: true,
        message: "Candidates successfully listed in cache",
        data: cacheResult,
        code: 200,
      };
    }

    // BANCO RELACIONAL - PG
    const result = await repository.list(UserType.Candidate);

    const data = result?.map((candidate) => candidate.toJson());

    await cacheRepository.set("candidates", data);

    return {
      ok: true,
      message: "Candidates successfully listed",
      data,
      code: 200,
    };
  }
}
