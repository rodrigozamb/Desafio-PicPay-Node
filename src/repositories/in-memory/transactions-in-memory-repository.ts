import { $Enums, Prisma, Transaction, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "crypto";
import { TransactionsRepository } from "../transactions-repository";



export class inMemoryTransactionsRepository implements TransactionsRepository{
    
    public transactions: Transaction[] = []
    

    async validate(transactionId: string){

        const id = this.transactions.findIndex(item => item.id == transactionId)

        if( id < 0){
            return null
        }

        this.transactions[id].validated_at = new Date()
        
        return this.transactions[id]
    }

    async create({fromId,toId,value,}: Prisma.TransactionUncheckedCreateInput){

        const transaction = {
            id: randomUUID(),
            value,
            toId,
            fromId,
            created_at: new Date(),
            validated_at: null 
        }

        this.transactions.push(transaction)

        return transaction
    }
}