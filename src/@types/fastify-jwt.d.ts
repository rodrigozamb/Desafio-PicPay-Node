import { $Enums } from "@prisma/client";
import fastify from "fastify";

declare module '@fastify/jwt'{
    export interface FastifyJWT{
        user:{
            sub:string
            role: $Enums.Role
        }
    }
}