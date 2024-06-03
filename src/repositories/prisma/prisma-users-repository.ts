import { Prisma, $Enums } from "@prisma/client";
import { UsersRepository, checkValidTransactionStatus } from "../users-repository";
import { prisma } from "@/lib/prisma";




export class PrismaUsersRepository implements UsersRepository{
    
    
    async create(data: Prisma.UserCreateInput) {
        
        const user = await prisma.user.create({
            data
        })

        return user;
    }

    async findByEmail(email: string): Promise<{ id: string; nome: string; senha_hash: string; cpf: string; email: string; wallet: number; role: $Enums.Role; created_at: Date; } | null> {
        const user = await prisma.user.findFirst({
            where:{

                email
            }
        })

        return user
    }

    async findUserByCPFOrEmail(data: { cpf: string; email: string; }) {
        const user = await prisma.user.findFirst({
            where:{

                OR:[{cpf: data.cpf}, {email: data.email}]
            }
        })

        return user
    }
    async checkValidTransaction(data: { payer: string; payee: string; value: number; }): Promise<checkValidTransactionStatus> {
        const payerUser = await prisma.user.findUnique({
            where:{
                id: data.payer
            }
        })
        const payeeUser = await prisma.user.findUnique({
            where:{
                id: data.payee
            }
        })

        if(!payerUser || !payeeUser){
            return checkValidTransactionStatus.InvalidUsers
        }

        if(payerUser.wallet < data.value){
            return checkValidTransactionStatus.InvalidCredit
        }

        return checkValidTransactionStatus.validTransaction
    }


    async transfer(data: { payer: string; payee: string; value: number; })   {
        
        const payerUser = await prisma.user.findUnique({
            where:{
                id: data.payer
            }
        })
        const payeeUser = await prisma.user.findUnique({
            where:{
                id: data.payee
            }
        })


        if(payeeUser && payerUser){

            await prisma.user.update({
                where:{
                    id: data.payer
                },
                data:{
                    wallet: payerUser.wallet - data.value
                }
            })

            await prisma.user.update({
                where:{
                    id: data.payee
                },
                data:{
                    wallet: payeeUser.wallet + data.value
                }
            })
        }

    }

}