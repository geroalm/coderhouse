import { usersModel } from "./models/security/users.model.js";

export class UserManagerMongo{
    constructor(){
        this.model = usersModel;
}

async findOne(userEmail) {
    try {
      return await this.model.findOne({email:userEmail});
    } catch (error) {
        throw new Error("Error al recuperar el usuario")
    }
}

async create(newUser) {
    try {
      return await this.model.create(newUser);
    } catch (error) {
        throw new Error("Error al crear el usuario")
    }
}
async findById(uId) {
    try {
      return await this.model.findById(uId);
    } catch (error) {
        throw new Error("Error al recuperar el usuario")
    }
}

}