import { Prisma, Transaction, User } from "@prisma/client";



export interface TransactionsRepository{

    create(data: Prisma.TransactionUncheckedCreateInput): Promise<Transaction>
    validate(transactionId: string): Promise<Transaction | null>
}