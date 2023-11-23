import { usersDao } from "../dao/factory.js";

export class UsersService {


    static findOne(userEmail) {
        try {
          return  usersDao.findOne(userEmail);
        } catch (error) {
            throw new Error(error)
        }
    }
    
    static create(newUser) {
        try {
          return  usersDao.create(newUser);
        } catch (error) {
            throw new Error(error)
        }
    }
    static findById(uId) {
        try {
          return  usersDao.findById(uId);
        } catch (error) {
            throw new Error(error)
        }
    }
    
}