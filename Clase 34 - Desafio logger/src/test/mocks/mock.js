import {faker} from "@faker-js/faker";

const { database, commerce, image } = faker;
const category = ["Ropa","Tecnologia","Deportes"]
//funcion para generar un producto
export const generateProduct = ()=>{
    return {
        id: database.mongodbObjectId(),
        title: commerce.product(),
        description: commerce.productDescription(),
        price: parseFloat(commerce.price()),
        code: faker.string.numeric(5),
        status:true,
        stock: parseInt(faker.string.numeric(2)),
        category: getCategory(),
        thumbnails: faker.image.url,
    }
};

export const getCategory =()=>{
    return category[getRandomInt(3)]
 }

 
export const getRandomInt = (max) => {
    const number = Math.floor(Math.random() * max) //entre 0 y 2
}




// console.log(generateUser());