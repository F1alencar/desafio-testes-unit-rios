import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase"



let usersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
describe("Create User", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        createUserUseCase = new CreateUserUseCase(usersRepository);
    })

    it("should be able to create a user", async () => {
    
        const user = await createUserUseCase.execute({
            name: "Test User",
            email: "test@test.com",
            password: "1234"
        });

        expect(user).toHaveProperty("id");
    });

    it("should not create a user if email it already exists", async () => {
        expect(async () => {
            
            await createUserUseCase.execute({
                name: "TestUser1",
                email: "test@test.com",
                password: "1235"
            });

            await createUserUseCase.execute({
                name: "TestUser2",
                email: "test@test.com",
                password: "1235"
            });
        }).rejects.toBeInstanceOf(CreateUserError);

    })
})