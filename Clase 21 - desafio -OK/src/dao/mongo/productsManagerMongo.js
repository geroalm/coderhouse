import { productsModel } from "./models/products.model.js";
import Mongoose from "mongoose";

export class ProductsManagerMongo{
    constructor(){
        this.model = productsModel
    }
    async createProduct(productInfo){
        try {
           productInfo.status=true;
           const res = await this.model.create(productInfo)
           return res;
        } catch (error) {
            console.log(error)
            throw new Error("No se pudo crear el producto");
        }
    };
    async  getProducts(query,options){ //agregar filtro por status
        try {
            const query = {status:true}
            console.log("query: ",query);
           const result = await this.model.paginate({...query},options)
           console.log(result);
            return result;
        } catch (error) {
            console.log(error)
            throw new Error("No se pudieron recuperar los productos");
        }
    };
    async getProductById(productId){
        try {
            if(!productId) throw new Error("Error en la busqueda");
            const product = await this.model.findById(productId);
            return product;
        } catch (error) {
            console.log(error);
            throw new Error("No se pudo recuperar el producto");
        }
    };
    async updateProduct(productId, productModified){
        try {
            // const result = await this.model.updateOne({_id:productId},newProductInfo);
            const result = await this.model.findByIdAndUpdate(productId,productModified,{new:true});
            if(!result){
                throw new Error("No se pudo encontrar el producto a actualizar");
            }
            return result;
        } catch (error) {
            console.log("updateProduct",error.message);
            throw new Error("No se pudo actualizar el producto");
        }
    };

    async deleteProduct(productId){
        try {
            const product = await this.getProductById(productId);
            if(!product) {
                throw new Error("Producto no disponible");
            }
            product.status=false;
            return await this.updateProduct(productId,product)
        } catch (error) {
            console.log(error);
            throw new Error(error.message);
        }
    
}
}