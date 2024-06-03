import { UserAlreadyExistsError } from "@/use-cases/errors/user-already-exists-error";
import { makeCreateUserUseCase } from "@/use-cases/factories/make-create-user-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";



export async function create(req: FastifyRequest,res:FastifyReply){

    const createBodySchema = z.object({
        nome: z.string(),
        cpf: z.string().min(11),
        email: z.string().email(),
        senha: z.string().min(6)
    })

    const {nome, email, senha, cpf} = createBodySchema.parse(req.body)

    try{

        const createUserUseCase = makeCreateUserUseCase()
        await createUserUseCase.execute({
            cpf,
            email,
            nome,
            senha
        })

    }catch(err){
        if(err instanceof UserAlreadyExistsError){
            return res.status(409).send({message: err.message}) 
        }

        throw err
    }

    return res.status(201).send({message: "Sucess"})

}