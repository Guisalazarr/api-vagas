import { CreateRecruiterUsecase } from "../../../../src/app/features/recruiter/usecases/create-recruiter.usecase";
import { UserRepository } from "../../../../src/app/features/user/repositories/user.repository";
import { UserType } from "../../../../src/app/models/user-type.model";
import { User } from "../../../../src/app/models/user.model";
import { CacheRepository } from "../../../../src/app/shared/database/repositories/cache.repository";
import { CacheDatabase } from "../../../../src/main/database/cache.connection";
import { Database } from "../../../../src/main/database/database.connection";

describe("Create Recruiter Usecase", () => {
  beforeAll(async () => {
    await Database.connect();
    await CacheDatabase.connect();
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    await Database.connection.destroy();
    await CacheDatabase.connection.quit();
  });

  const createSut = () => {
    return new CreateRecruiterUsecase();
  };

  const userMockSut = () => {
    return new User(
      "any_name",
      "any_email",
      "any_password",
      UserType.Recruiter,
      "any_enterpriseName"
    );
  };

  test("Retorna 400 caso usuario(email) já exista", async () => {
    const sut = createSut();
    const user = userMockSut();

    jest.spyOn(UserRepository.prototype, "getByEmail").mockResolvedValue(user);

    const result = await sut.execute({
      email: "any_email",
      name: "any_name",
      password: "any_password",
      enterpriseName: "any_enterpriseName",
    });

    expect(result.ok).toBe(false);
    expect(result.message).toBe("User already exists");
    expect(result.code).toBe(400);
    expect(result).not.toHaveProperty("data");
  });

  test("Retorna 201 caso o usuário seja criado com sucesso", async () => {
    const sut = createSut();

    const params = {
      email: "any_new_email",
      name: "any_new_name",
      password: "any_new_password",
      enterpriseName: "any_new_enterpriseName",
    };

    jest
      .spyOn(UserRepository.prototype, "getByEmail")
      .mockResolvedValue(undefined);
    jest.spyOn(UserRepository.prototype, "create");
    jest.spyOn(CacheRepository.prototype, "delete");

    const result = await sut.execute(params);

    expect(result.ok).toBe(true);
    expect(result.message).toBe("Recruiter successfully created");
    expect(result.code).toBe(201);
    expect(result).not.toHaveProperty("data");
  });
});
