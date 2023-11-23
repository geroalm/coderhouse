import { productsDao } from "../dao/factory.js";

export class ProductsService{

    static getProducts = (query,options)=>{
        try {
            return productsDao.getProducts(query,options);
        } catch (error) {
            throw new Error (error);
        }
    };

    static createProduct(productInfo){
        try {
            return productsDao.createProduct(productInfo);
        } catch (error) {
            throw new Error (error);
        }
    };

    static getProductById(productId){
        try {
          return productsDao.getProductById(productId)
    } catch (error) {
        throw new Error (error);
    }
    };
    static updateProduct(productId, productModified){
        try {
            return productsDao.updateProduct(productId, productModified);
        } catch (error) {
            throw new Error (error);
        }
        
    };

    static deleteProduct(productId){
        try {
            return productsDao.deleteProduct(productId);
        } catch (error) {
            throw new Error (error);
        }
       
}

}