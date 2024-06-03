export class UserAlreadyExistsError extends Error{
    constructor(){
        super("Email or CPF already exists")
    }
}