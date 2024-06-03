import { TransactionsRepository } from "@/repositories/transactions-repository";
import { UsersRepository, checkValidTransactionStatus } from "@/repositories/users-repository";
import { ResourceNotFoundError } from "../errors/resource-not-found-error";
import { InsuficientCreditError } from "../errors/insuficient-credit-error";
import axios from "axios";
import axiosRetry from "axios-retry";

import {  TransferNotAuthorizedError } from "../errors/transfer-not-authorized";


axiosRetry(axios, {
    retries: 5, // number of retries
    retryDelay: (retryCount) => {
        console.log(`retry attempt: ${retryCount}`);
        return retryCount * 1000; // time interval between retries
    },
    retryCondition: (error:any) => {
        // if retry condition is not specified, by default idempotent requests are retried
        
        return error.response.status === 504;
    },
});

interface ICreateTransactionRequest{

    value: number
    payer: string
    payee: string

}


export class CreateTransactionUseCase{

    constructor(
        private transactionRepository: TransactionsRepository,
        private usersRepository: UsersRepository
        
    ){}


    async execute({payer, payee, value}:ICreateTransactionRequest){

        const validTransaction = await this.usersRepository.checkValidTransaction({payer, payee, value})
        if(validTransaction == checkValidTransactionStatus.InvalidUsers || value <= 0.0){
            throw new ResourceNotFoundError()
        }
        if(validTransaction == checkValidTransactionStatus.InvalidCredit){
            throw new InsuficientCreditError()
        }

        // Transfer money from accounts
        await this.usersRepository.transfer({payer, payee, value})

        // Create Transaction Record
        const transaction = await this.transactionRepository.create({
            value,
            fromId: payer,
            toId: payee
        })

        try {
            // Valid Transaction
            const response = await axios.get('https://util.devi.tools/api/v2/authorize')
        } catch (error) {
            await this.usersRepository.transfer({payer:payee, payee:payer, value})
            throw new TransferNotAuthorizedError()
        }



        // Validated Transaction Record
        const validatedTransaction = await this.transactionRepository.validate(transaction.id)
        
        try{
            // Send final message
            const answerResponse = await axios.post('https://util.devi.tools/api/v1/notify')
        }catch(err){
            console.log(err)    
        }

        return {validatedTransaction}
    }

}