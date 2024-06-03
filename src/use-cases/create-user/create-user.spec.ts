import { inMemoryUsersRepository } from '@/repositories/in-memory/users-in-memory-repository'
import {expect, describe, it, beforeEach, beforeAll} from 'vitest'
import { CreateUserUseCase } from './create-user'
import { compare } from 'bcryptjs'
import { UserAlreadyExistsError } from '../errors/user-already-exists-error'


let usersRepository: inMemoryUsersRepository
let sut: CreateUserUseCase

describe('Create User use case', ()=>{



    beforeEach(()=>{
        usersRepository = new inMemoryUsersRepository()
        sut = new CreateUserUseCase(usersRepository)
    })

    it('Should hash user password upon registration',async ()=>{

        const{ user } = await sut.execute({
            nome:"Jhon Doe",
            email:"test@123.com",
            senha:"123123123",
            cpf:'123456789'
        })

        const isPasswordCorrectlyHashed = await compare('123123123',user.senha_hash)
    
        expect(isPasswordCorrectlyHashed).toBe(true)
    })

    it('Should not be able to register with duplicate email',async ()=>{

        const usersRepository = new inMemoryUsersRepository()
        const sut = new CreateUserUseCase(usersRepository)

        const email = "test@123.com"

        await sut.execute({
            nome:"User1",
            email,
            senha:"123123123",
            cpf:"cpf-test1"
        })
    
        await expect(()=>
            sut.execute({
                nome:"User2",
                email,
                senha:"123123123",
                cpf:"cpf-test"
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    
    })

    it('Should not be able to register with duplicate cpf',async ()=>{

        const usersRepository = new inMemoryUsersRepository()
        const sut = new CreateUserUseCase(usersRepository)

        const cpf = "cpf-test"
        await sut.execute({
            nome:"User1",
            email:"email2@test.com",
            senha:"123123123",
            cpf
        })
    
        await expect(()=>
            sut.execute({
                nome:"User2",
                email:"email1@test.com",
                senha:"123123123",
                cpf
            })
        ).rejects.toBeInstanceOf(UserAlreadyExistsError)
    
    })
    
})