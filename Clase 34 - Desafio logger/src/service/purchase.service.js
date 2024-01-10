import { purchaseDao } from "../dao/factory.js";

export class PurchaseService {


    static findOne(pId) {
        try {
          return  purchaseDao.findOne(pId);
        } catch (error) {
            throw new Error(error)
        }
    }
    
    static create(newPurchase) {
        try {
          return  purchaseDao.create(newPurchase);
        } catch (error) {
            throw new Error(error)
        }
    }
    static findById(pId) {
        try {
          return  purchaseDao.findById(pId);
        } catch (error) {
            throw new Error(error)
        }
    }
    
}