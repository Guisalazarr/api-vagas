import { Recruiter } from "../../../models/recruiter.model";
import { CacheRepository } from "../../../shared/database/repositories/cache.repository";
import { Result, Usecase } from "../../../shared/util";
import { UserRepository } from "../../user/repositories/user.repository";

interface CreateRecruiterParams {
  name: string;
  email: string;
  password: string;
  enterpriseName: string;
}

export class CreateRecruiterUsecase implements Usecase {
  public async execute(params: CreateRecruiterParams): Promise<Result> {
    // 1 - definir os parametros
    // id, nome, e-mail(único), senha, nome da empresa.

    // 2 - verificar se o user ja existe (email)
    const repository = new UserRepository();
    const user = await repository.getByEmail(params.email);

    // Se user existe com o mesmo email, retorna erro 400
    if (user) {
      return {
        ok: false,
        message: "User already exists",
        code: 400,
      };
    }

    const recruiter = new Recruiter(
      params.name,
      params.email,
      params.password,
      params.enterpriseName
    );

    await repository.create(recruiter);

    const cacheRepository = new CacheRepository();
    await cacheRepository.delete("recruiters");

    return {
      ok: true,
      message: "Recruiter successfully created",
      code: 201,
    };
  }
}
