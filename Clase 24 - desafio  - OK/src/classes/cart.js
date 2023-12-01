export class Cart{
    #id;
    constructor(){
        this.itemsProducts =  []
    }


    get getId(){
        return this.#id;
    }
    set setId(id){
        this.#id = id;
    }
    
    get getItemsProducts(){
        return this.itemsProducts;
    }

    set setItemsProducts(itemsProducts){
        this.itemsProducts = itemsProducts
    }

}