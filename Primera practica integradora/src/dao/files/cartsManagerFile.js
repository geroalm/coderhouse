import fs from "fs"
import { Cart } from "../../classes/cart.js";

export class CartManagerFiles{
    constructor(path){
      this.pathFile = path;
    };
    fileExists(){
        return fs.existsSync(this.pathFile);
    }

    async getCarts(){
        try {
           if(this.fileExists){
            try {
                const content = await fs.promises.readFile(this.pathFile,"utf-8");
                let carts = JSON.parse(content);
                return carts;
            } catch (error) 
            {
                throw "Error al intentar leer los carritos"
            }
           } else{
            throw new Error("No se pudieron obtener los carritos")
           } 
        } catch (error) {
            throw error;
        }

    }

    async getCartById(id){
        try {  
            if(this.fileExists){
                const content = await fs.promises.readFile(this.pathFile,"utf-8");
                const carts = JSON.parse(content);
                let cart =  carts.find(cadaCart => cadaCart.id === parseInt(id)); 
                if(cart) {
                    const oCart = new Cart();
                    oCart.itemsProducts = cart.itemsProducts;
                    oCart.id = cart.id;
                    return oCart;
                }
                else throw new Error("No se encontro el carrito");
            }            
            else
                throw new Error("No se pudo abrir el carrito")
            
        } catch(error){
            throw new Error(error);
        }
            
    }

    // Recupero todos los carts, le seteo una id al nuevo y lo agrego
    async addCart(newCart){
        if(this.fileExists()){
        try{
            const carts = await this.getCarts();
            newCart.id = await this.getNewId(); 
            newCart.itemsProducts = [];
            carts.push(newCart);
            await this.persistCarts(carts);
        }catch(error) {
            console.log(error);
            throw error;
        }

        }else throw new Error("No existe el archivo")
    }

    async getNewId (){
        if(this.fileExists()){
            const content = await fs.promises.readFile(this.pathFile,"utf-8");
                let carts = JSON.parse(content);
            let max = carts.reduce((max, cart) => cart.id > max ? cart.id : max, 0);
        return max+1;
        }
        
    }

    async persistCarts(carts){
        try{
            await fs.promises.writeFile(this.pathFile,JSON.stringify(carts, null,"\t"));
        }
        catch(error) {
            throw ("Error al escribir el archivo: ",error)
        }
    }

    // recorro los carts y cuando el id del modificado coincide lo reemplazo
    async updateCart(newCart){
        let cartList = await this.getCarts();
        cartList = cartList.map(eachCart =>{
            return eachCart.id === newCart.id ? newCart : eachCart;
        })

        await this.persistCarts(cartList);

    }
   
    
}