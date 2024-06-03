import { UsersRepository } from "@/repositories/users-repository";
import { User } from "@prisma/client";
import { hash } from "bcryptjs";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error";


interface ICreateUserRequest{

    nome: string
    email: string
    cpf: string
    senha: string

}

interface ICreateUserResponse{
    user: User
}

export class CreateUserUseCase{

    constructor(
        private usersRepository: UsersRepository
    ){}


    async execute({cpf,email,nome,senha}:ICreateUserRequest): Promise<ICreateUserResponse>{

        const senha_hash = await hash(senha, 6)

        const userAlreadyExists = await this.usersRepository.findUserByCPFOrEmail({cpf,email});

        if(userAlreadyExists){
            throw new UserAlreadyExistsError()
        }

        const user = await this.usersRepository.create({
            cpf,
            email,
            nome,
            senha_hash
        })

        return {user}
    }

}