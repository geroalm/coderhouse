
import fs from "fs"


export class ProductManagerFiles{
    constructor(path){
      this.pathFile = path;
    };
    fileExists(){
        return fs.existsSync(this.pathFile);
    }

    async getProducts(filtDeleted){
        try {
           if(this.fileExists){
            try {
                const content = await fs.promises.readFile(this.pathFile,"utf-8");
                let products = JSON.parse(content);
                 if(filtDeleted) products = products.filter(prod => prod.status == true);
                return products;
            } catch (error) 
            {
                throw "Error al intentar leer los produtos"
            }
           } else{
            throw new Error("No se pudieron obtener los productos")
           } 
        } catch (error) {
            throw error;
        }

    }

    async getProductById(id){
        try {  
            if(this.fileExists){
                const content = await fs.promises.readFile(this.pathFile,"utf-8");
                const productos = JSON.parse(content);
                let product =  productos.find(cadaProd => cadaProd.id === parseInt(id)); 
                if(product && product.status == true) return product
                else throw new Error("No se encontro el producto");
            }            
            else
                throw new Error("No se pudo abrir el archivo")
            
        } catch(error){
            throw new Error(error);
        }
            
    }

    async addProduct(newProduct){
        if(this.fileExists()){
        try{
            const products = await this.getProducts(null);
            newProduct.id = await this.getNewId();  //le paso la lista de productos para conseguir un nuevo ID
            products.push(newProduct);
            newProduct.status=true;
            await this.persistProducts(products);
        }catch(error) {
            console.log(error);
            throw error;
        }

        }else throw new Error("No existe el archivo")
    }

    async getNewId (){
        if(this.fileExists()){
            const content = await fs.promises.readFile(this.pathFile,"utf-8");
                let products = JSON.parse(content);
            let max = products.reduce((max, product) => product.id > max ? product.id : max, 0);
        return max+1;
        }
        
    }

    async persistProducts(products){
        try{
            await fs.promises.writeFile(this.pathFile,JSON.stringify(products, null,"\t"));
        }
        catch(error) {
            console.log(error);
            throw ("Error al escribir el archivo: ",error)
        }
    }
    async deleteProductById(productId){
        const toDeleteProd = await this.getProductById(productId);
        if (!toDeleteProd) throw new Error({message:"El producto que intenta borrar no fue encontrado"});
        toDeleteProd.status=false;
        let products = await this.getProducts();
            products = products.map(product => 
                product.id === parseInt(productId) ? toDeleteProd : product
            );
            await this.persistProducts(products)
    }

    
         
   
    
}