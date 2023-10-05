var clientSocket = io(); // crea la conexion con el socket server, utiliza el url.
//en este caso reakTime.hbs 

const createProductForm = document.getElementById("productForm");
const productList = document.getElementById("productList");

//Envío al back via socket
createProductForm.addEventListener("submit",(e)=>{
e.preventDefault();
const formData = new FormData(createProductForm);

const jsonData = {};
for (const [key, value] of formData.entries()) {
    jsonData[key] = value;
        
    }
jsonData.price = parseInt(jsonData.price);

//Envio al Server via socket
clientSocket.emit("addProduct",jsonData); 
createProductForm.reset(); 
   
}); 

//recibimos los productos
clientSocket.on("productsList", (dataProducts)=>{
    console.log(dataProducts);
    let productsElms=

    `<table class="table table-striped">
    <thead>
      <tr>
  
        <th scope="col">TITLE</th>
        <th scope="col">DESCRIPTION</th>
        <th scope="col">PRICE</th>
        <th scope="col">CODE</th>
        <th scope="col">STOCK</th>
        <th scope="col">CATEGORY</th>
        <th scope="col">OPERATION</th>
      </tr>
    </thead>
    <tbody>`

    dataProducts.forEach(product=>{
        productsElms +=
        `
    <tr>
      <td>${product.title}</td>
      <td>${product.description}</td>
      <td>${product.price}</td>
      <td>${product.code}</td>
      <td>${product.stock}</td>
      <td>${product.category}</td>
      <td>  
      <button class="btn btn-dark"
      onclick=deleteProduct('${product._id}')>Eliminar
      </button>
      </td>
    </tr>`

    });

    productsElms += 
    `
    </tbody>
    </table>
    `

    productList.innerHTML=productsElms;
});

const deleteProduct = (id)=>{
  console.log("delete: ",id);
  clientSocket.emit("deleteProduct",id);
}; 