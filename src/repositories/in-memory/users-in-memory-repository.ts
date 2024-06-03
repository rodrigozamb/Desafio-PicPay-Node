import { $Enums, Prisma, User } from "@prisma/client";
import { UsersRepository } from "../users-repository";
import { randomUUID } from "crypto";
import { checkValidTransactionStatus } from "../users-repository";


export class inMemoryUsersRepository implements UsersRepository{
    
    public users: User[] = []
    

    async findByEmail(email: string){
        const user = this.users.find((item) => item.email == email)
        if(!user){
            return null
        }
        return user
    }

    async transfer(data: { payer: string; payee: string; value: number; }){
        const payerExists =  this.users.find( item => item.id == data.payer)
        const payeeExists =  this.users.find( item => item.id == data.payee)

        if(payerExists && payeeExists){
            payerExists.wallet -= data.value
            payeeExists.wallet += data.value
        }
        
    }

    async checkValidTransaction(data: { payer: string; payee: string; value: number; }) {
        
        
        const payerExists =  this.users.find( item => item.id == data.payer)
        const payeeExists =  this.users.find( item => item.id == data.payee)

        if(!payerExists || !payeeExists){
            return checkValidTransactionStatus.InvalidUsers
        }

        if(payerExists.wallet < data.value){
            return checkValidTransactionStatus.InvalidCredit
        }

        return checkValidTransactionStatus.validTransaction

    }

    async findUserByCPFOrEmail(data: { cpf: string; email: string; }) {
        const user = this.users.find((item)=>{

            if(item.cpf == data.cpf || item.email == data.email){
                return item
            }
        })

        if(!user){
            return null
        }

        return user
    }

    async create({cpf,email,nome,senha_hash,id}: Prisma.UserCreateInput){

        const user = {
            id: id ?? randomUUID(),
            nome,
            senha_hash,
            cpf,
            email,
            wallet: 1000.0,
            created_at: new Date(),
            role: $Enums.Role.PERSON
        }

        this.users.push(user)

        return user
    }
}