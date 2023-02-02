
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { OperationType } from "../createStatement/CreateStatementController";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";


let usersRepository: InMemoryUsersRepository;
let statementsRepository: InMemoryStatementsRepository;
let getStatementOperationUseCase: GetStatementOperationUseCase;


describe("Get Statement Operation", () => {
    beforeEach(() => {
        statementsRepository = new InMemoryStatementsRepository();
        usersRepository = new InMemoryUsersRepository();
        getStatementOperationUseCase = new GetStatementOperationUseCase(usersRepository, statementsRepository);
    });

    it("should be possible to search the extract by statement id", async () => {
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

        const operation = await getStatementOperationUseCase.execute({
            user_id: user.id as string, 
            statement_id: deposit.id as string
        });

        expect(operation).toEqual(deposit);
    });

    it("should not be possible to search the extract by statement id with user non-existent", () => {
        expect(async () => {
            await getStatementOperationUseCase.execute({
                user_id: "testUserId", 
                statement_id: "testStatementId"
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
    });
    
    it("should not be possible to search the extract by non-existent statement id", () => {
        expect(async () => {
            const user = await usersRepository.create({
                name: "TestUser1",
                email: "test@test.com",
                password: "1234"
            });

            await getStatementOperationUseCase.execute({ 
                user_id: user.id as string, 
                statement_id: "testStatementId"
            });
        }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
    });
})