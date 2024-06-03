import { Prisma, User } from "@prisma/client";

export enum checkValidTransactionStatus{
    InvalidUsers,
    InvalidCredit,
    validTransaction
}

export interface UsersRepository{

    create(data: Prisma.UserCreateInput): Promise<User>
    findByEmail(email: string) : Promise<User | null>
    findUserByCPFOrEmail(data:{ cpf: string, email: string}): Promise<User | null>
    checkValidTransaction(data:{payer: string, payee: string, value: number}): Promise<checkValidTransactionStatus>
    transfer(data:{payer: string, payee: string, value: number}): Promise<void>
}