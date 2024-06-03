import { FastifyInstance } from "fastify";
import { create } from "./create";
import { verifyUserRole } from "@/middlewares/verify-user-role";
import { verifyJWT } from "@/middlewares/verify-jwt";


export async function transactionsRoutes(app:FastifyInstance) {
    
    app.addHook('onRequest',verifyJWT)

    app.post('/transfer', {onRequest:[verifyUserRole('PERSON')]}, create)
}