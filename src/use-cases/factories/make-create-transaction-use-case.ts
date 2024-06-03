import { PrismaTransactionsRepository } from "@/repositories/prisma/prisma-transactions-repository";
import { CreateTransactionUseCase } from "../create-transaction/create-transaction";
import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users-repository";


export function makeCreateTransactionUseCase(){

    const transactionRepository = new PrismaTransactionsRepository()
    const usersRepository = new PrismaUsersRepository()
    const createTransactionUseCase = new CreateTransactionUseCase(transactionRepository, usersRepository)

    return createTransactionUseCase
}