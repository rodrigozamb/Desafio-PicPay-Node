import { FastifyInstance } from "fastify";
import { create } from "./create";
import { authenticate } from "./authenticate";
import { refresh } from "./refresh";

export async function userRoutes(app: FastifyInstance){


    app.post('/users',create)
    app.post('/sessions', authenticate)
    app.patch('/token/refresh', refresh)
}