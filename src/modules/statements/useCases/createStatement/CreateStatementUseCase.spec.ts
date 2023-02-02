import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { OperationType } from "./CreateStatementController";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let statementsRepository: InMemoryStatementsRepository;
let createStatementUseCase: CreateStatementUseCase;
let usersRepository: InMemoryUsersRepository;

describe("Create Statement", () => {
    beforeEach(() => {
        statementsRepository = new InMemoryStatementsRepository();
        usersRepository = new InMemoryUsersRepository();
        createStatementUseCase= new CreateStatementUseCase(usersRepository, statementsRepository);
    });

    it("should be possible to make a deposit", async () => {
        const user = await usersRepository.create({
            name: "TestUser1",
            email: "test@test.com",
            password: "1234"
        });

        const deposit =  await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Test Deposit"
        });

        expect(deposit).toHaveProperty("id");
        expect(deposit.user_id).toEqual(user.id)
    });

    it("should not be possible to make a deposit into a non-existent account", () => {
        expect(async () => {
            await createStatementUseCase.execute({
                user_id: "testUserId",
                type: OperationType.DEPOSIT,
                amount: 100,
                description: "Test Deposit"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
    });

    it("should be possible to make a withdraw", async () => {
        const user = await usersRepository.create({
            name: "TestUser1",
            email: "test@test.com",
            password: "1234"
        });

        await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.DEPOSIT,
            amount: 100,
            description: "Test Deposit"
        }); 

        const withdraw = await createStatementUseCase.execute({
            user_id: user.id as string,
            type: OperationType.WITHDRAW,
            amount: 100,
            description: "Test Withdraw"
        });
        
        expect(withdraw).toHaveProperty("id");
        expect(withdraw.user_id).toEqual(user.id);
    });

    it("should not be possible to make a deposit into a non-existent account", () => {
      
       expect(async () => {
        await createStatementUseCase.execute({
            user_id: "testUserId",
            type: OperationType.WITHDRAW,
            amount: 100,
            description: "Test Withdraw"
        });
       }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound)
        
    });

    it("should not be possible to withdraw when the balance is insufficient", () => {
        expect(async () => {
            const user = await usersRepository.create({
                name: "TestUser1",
                email: "test@test.com",
                password: "1234"
            });

            await createStatementUseCase.execute({
                user_id: user.id as string,
                type: OperationType.DEPOSIT,
                amount: 10,
                description: "Test Deposit"
            }); 

           await createStatementUseCase.execute({
                user_id: user.id as string,
                type: OperationType.WITHDRAW,
                amount: 100,
                description: "Test Withdraw"
            });
        }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
    
    });

})