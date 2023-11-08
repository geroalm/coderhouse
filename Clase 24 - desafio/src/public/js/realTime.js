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

    dataProducts.docs.forEach(product=>{
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

    <nav aria-label="Page navigation example">
  <ul class="pagination justify-content-end">
    <li class="page-item disabled">
    </li>
    ${dataProducts.hasPrevPage ? `<li class="page-item"><a class="page-link" id="prev" href="#" onclick="prevPage('${dataProducts.prevPage}')">Previous</a></li>` : ''}
    <li class="page-item disabled"><a class="page-link" href="#">-</a></li>
    <li class="page-item disabled"><a class="page-link" href="#">-</a></li>
    <li class="page-item disabled"><a class="page-link" href="#">-</a></li>
    ${dataProducts.hasNextPage ? `<li class="page-item"><a class="page-link" id="next" href="#" onclick="nextPage('${dataProducts.nextPage}')">Next</a></li>` : ''}


    </li>
  </ul>
</nav>
    `
    

    productList.innerHTML=productsElms;
});

const deleteProduct = (id)=>{
  clientSocket.emit("deleteProduct",id);
};

const prevPage = (page)=>{
  const options = {
    limit:3,
    page:page,
    lean:true
}
  clientSocket.emit("getPage",options);
};
const nextPage = (page)=>{
  const options = {
    limit:3,
    page:page,
    lean:true
}
  clientSocket.emit("getPage",options);
};