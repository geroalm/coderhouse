
const addToCart = (product)=>{
    // cartId hardcodeado
  const cartId = '652f174f6dda60d8b59054b3';

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      cartId,
      product
    })
  }
  
  fetch(`http://localhost:8080/api/carts/${cartId}/products/${product}`, options)
  
    .then((response) => response.json())
    .then((data) => {
      console.log('Producto agregado al carrito:', data);
    })
    .catch((error) => {
      console.error('Error al agregar el producto al carrito:', error);
    });

}

