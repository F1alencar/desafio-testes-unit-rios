import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";



let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getBalanceUseCase: GetBalanceUseCase;

describe("Get Balance", () => {
    beforeEach(() => {
        statementsRepository = new InMemoryStatementsRepository();
        usersRepository = new InMemoryUsersRepository();
        getBalanceUseCase = new GetBalanceUseCase(statementsRepository, usersRepository);
    });

    it("should be possible to search the customer's bank statement", async () => {
        const user = await usersRepository.create({
            name: "TestUser1",
            email: "test@test.com",
            password: "1234"
        });

        const deposit = await statementsRepository.create({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Test Deposit"
        });

        const withdraw = await statementsRepository.create({
            user_id: user.id as string,
            type: OperationType.WITHDRAW,
            amount: 100,
            description: "Test Deposit"
        });


        const balance = await getBalanceUseCase.execute({user_id: user.id as string});

        expect(balance.balance).toBe(deposit.amount - withdraw.amount);
        expect(balance.statement.length).toBe(2);
        expect(balance.statement[0].id).toBe(deposit.id)
    });

    it("should not be possible to fetch a statement from a non-existing account", () => {
        expect(async () => {
            await getBalanceUseCase.execute({user_id: "testUserId"});
        }).rejects.toBeInstanceOf(GetBalanceError);
    });


})