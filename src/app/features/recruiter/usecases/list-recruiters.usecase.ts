import { UserType } from "../../../models/user-type.model";
import { Result, Usecase } from "../../../shared/util";
import { UserRepository } from "../../user/repositories/user.repository";

export class ListRecruitersUsecase implements Usecase {
  public async execute(): Promise<Result> {
    const repository = new UserRepository();
    const result = await repository.list(UserType.Recruiter);

    return {
      ok: true,
      message: "Recruiters successfully listed",
      data: result?.map((recruiter) => recruiter.toJson()),
      code: 200,
    };
  }
}
