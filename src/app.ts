import fastify from "fastify";
import { ZodError } from "zod";
import { env } from "./env";
import { userRoutes } from "./http/controllers/users/routes";
import { transactionsRoutes } from "./http/controllers/transactions/routes";
import fastifyJwt from "@fastify/jwt";
import fastifyCookie from "@fastify/cookie";


export const app = fastify()


app.register(fastifyJwt, {
    secret: env.JWT_SECRET,
    cookie:{
        cookieName: 'refreshToken',
        signed: false
    },
    sign:{
        expiresIn: '10m'
    }
})

app.register(fastifyCookie)

app.register(userRoutes)
app.register(transactionsRoutes)

app.setErrorHandler((error, _, res)=>{

    if (error instanceof ZodError){
        return res
            .status(400)
            .send({
                message: 'Validation Error',
                issues: error.format()
            })
    }

    if(env.NODE_ENV != 'prod'){
        console.log(error)
    }

    return res.status(500).send({message:"Internal Server Error"})
})