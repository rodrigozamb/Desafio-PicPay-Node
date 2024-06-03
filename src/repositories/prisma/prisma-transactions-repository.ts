import { Prisma } from "@prisma/client";
import { TransactionsRepository } from "../transactions-repository";
import { prisma } from "@/lib/prisma";



export class PrismaTransactionsRepository implements TransactionsRepository{
    async create(data: Prisma.TransactionUncheckedCreateInput) {
        const transaction = await prisma.transaction.create({
            data
        })

        return transaction
    }
    
    async validate(transactionId: string) {
        const validateTransaction = await prisma.transaction.update({
            where:{
                id:transactionId
            },
            data:{
                validated_at: new Date()
            }
        })

        return validateTransaction
    }


}