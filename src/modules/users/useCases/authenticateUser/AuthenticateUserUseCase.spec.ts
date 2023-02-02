import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let usersRepository: InMemoryUsersRepository;
let authenticateUserUseCase: AuthenticateUserUseCase;
describe("Create User", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        authenticateUserUseCase = new AuthenticateUserUseCase(usersRepository);
    })

    it("should be able to create a user token", async () => {
        
        const user_password = await hash("1234", 8)
        await usersRepository.create({
            name: "Test User",
            email: "test@test.com",
            password: user_password
        });

        const userToken = await authenticateUserUseCase.execute({
            email: "test@test.com",
            password: "1234"
        })

        expect(userToken).toHaveProperty("token");
        expect(userToken).toHaveProperty("user.id")
    });

    it("should be able to authenticate an nonexistent user", () => {
        expect(async () => {
          await authenticateUserUseCase.execute({
            email: "false@email.com",
            password: "1234",
          });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
      });
      it("should be able to authenticate with incorrect password", () => {
        expect(async () => {
          const user = {
            email: "usertest@error.com",
            name: "User Test Error",
            password: "1234",
          };
    
          await usersRepository.create(user);
    
          await authenticateUserUseCase.execute({
            email: user.email,
            password: "incorrectPassword",
          });
        }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
      });
})