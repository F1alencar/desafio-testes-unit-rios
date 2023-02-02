import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

let showUserProfileUseCase: ShowUserProfileUseCase;
let usersRepository: InMemoryUsersRepository;
describe("Show Users", () => {
    beforeEach(() => {
        usersRepository = new InMemoryUsersRepository();
        showUserProfileUseCase = new ShowUserProfileUseCase(usersRepository);

    });

    it("should be able to show a user profile", async () => {
        const user = await usersRepository.create({
            name: "Test User",
            email: "test@test.com",
            password: "1234"
        });

        expect(await showUserProfileUseCase.execute(user.id as string)).toEqual(user);
    });

    it("should not be able to show a user profile if user not exists", () => {
        expect(async () => {
            const user_id = "12345";

            await showUserProfileUseCase.execute(user_id);
        }).rejects.toBeInstanceOf(ShowUserProfileError)
    })
});