

export class Product{
    #id;
    constructor(title,descrition,price,thumbnails,code,stock,category){
        this.title = title;
        this.description = descrition;
        this.price = price;
        this.code = code;
        this.status = true;
        this.stock = stock;
        this.category = category

    }

    get getId(){
        return this.#id;
    }
    set setId(id){
        this.#id = id;
    }

    get getThumbnails() {
        return this.thumbnails;
    }
    set setThumbnails(thumbnails) {
        this.thumbnails = thumbnails;
    }

}