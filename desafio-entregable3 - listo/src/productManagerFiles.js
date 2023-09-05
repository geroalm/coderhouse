import fs from "fs"

export class ProductManagerFiles{
    constructor(path){
      this.pathFile = path;
    };
    fileExists(){
        return fs.existsSync(this.pathFile);
    }

    addProduct(){}

    async getProducts(){
        try {
           if(this.fileExists){
            const contenido = await fs.promises.readFile(this.pathFile,"utf-8");
            const productos = JSON.parse(contenido);
            return productos;
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
                const contenido = await fs.promises.readFile(this.pathFile,"utf-8");
                const productos = JSON.parse(contenido);
                let producto =  productos.find(cadaProd => cadaProd.id === parseInt(id)) 
                if(producto) return producto
                else throw new Error("No se pudo obtener el producto");
            }            
            else
                throw new Error("No se pudo abrir el archivo")
            
        } catch(error){
            throw new Error("Error al buscar producto");
        }
            
    }
         
   
    
}