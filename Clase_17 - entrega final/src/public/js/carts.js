function sumSubtotals(items) {
    let total = 0;
  
    for (let i = 0; i < items.length; i++) {
      const subtotal = items[i].product.price * items[i].quantity;
      total += subtotal;
    }
  
    return total;
  }