import { UserType } from "../../../models/user-type.model";
import { Result } from "../../../shared/util";
import { Usecase } from "../../../shared/util/usecase.contract";
import { UserRepository } from "../../user/repositories/user.repository";

export class ListCandidateUsecase implements Usecase {
  public async execute(): Promise<Result> {
    const repository = new UserRepository();
    const result = await repository.list(UserType.Candidate);

    return {
      ok: true,
      message: "Candidates successfully listed",
      data: result?.map((candidate) => candidate.toJson()),
      code: 200,
    };
  }
}
