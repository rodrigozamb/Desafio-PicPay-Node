import { InsuficientCreditError } from "@/use-cases/errors/insuficient-credit-error";
import { ResourceNotFoundError } from "@/use-cases/errors/resource-not-found-error";
import { TransferNotAuthorizedError } from "@/use-cases/errors/transfer-not-authorized";
import { makeCreateTransactionUseCase } from "@/use-cases/factories/make-create-transaction-use-case";
import { FastifyReply, FastifyRequest } from "fastify";
import { z } from "zod";




export async function create(req:FastifyRequest, res: FastifyReply) {
    
    const createBodySchema = z.object({
        payer: z.string(),
        payee: z.string().min(11),
        value: z.coerce.number()
    })

    const { payee,payer,value } = createBodySchema.parse(req.body)

    try {
        
        const createTransactionUseCase = makeCreateTransactionUseCase()
        await createTransactionUseCase.execute({
            payee,
            payer,
            value
        })

    } catch (err) {
        if(err instanceof ResourceNotFoundError){
            return res.status(409).send({message: err.message}) 
        }
        
        if(err instanceof InsuficientCreditError){
            return res.status(409).send({message: err.message}) 
        }

        if(err instanceof TransferNotAuthorizedError){
            return res.status(405).send({message: err.message}) 
        }

        throw err
    }    

    return res.status(201).send()
}