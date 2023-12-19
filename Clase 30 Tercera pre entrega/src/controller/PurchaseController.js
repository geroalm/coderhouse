import { CartsService } from "../service/carts.service.js";
import { Purchase } from "../classes/purchase.js";
import { ProductsService } from "../service/products.service.js"
import { PurchaseService } from "../service/purchase.service.js";
import { TicketService } from "../service/ticket.service.js";

/* Controller para procesar la compra 
en este punto el carrito esta cargado con los productos a comprar
*/

/** TODO */
//tengo que: 
//traer el carrito validar stock, crear el ticket, guardar el historico a partir del carrito
export class PurchaseController {
    static purch = async (req, res) => {

        const cart = await CartsService.getCartById(req.user.cart);

        //validar stock disponible para cada producto
        let totalAcum = 0;
        let purchaseDatail = new Purchase();
        for (const cadaItem of cart.itemsProducts) { //recorro el carrito del usuario, creo los items del purchase, descuento stock, borro item del carrito
            if (cadaItem.product.stock >= cadaItem.quantity) { //si hay stock

                totalAcum += cadaItem.product.price * cadaItem.quantity; // dato para el ticket

                let newPurchaseItem = { //creo el item 
                    product: { title: cadaItem.product.title, price: cadaItem.product.price },
                    quantity: cadaItem.quantity
                }
                purchaseDatail.items.push(newPurchaseItem)

                try {
                    await deductStock(cadaItem.product._id, cadaItem.quantity); // descuento stock del producto y persisto
                    await updateCart(req.user.cart, cadaItem.product._id.toString()); //tiene que borrar del carrito el item
                } catch (error) {
                    console.log(error);
                    res.json({ error: "ERROR", message: "error al intentar crear una compra" })
                    return
                }

            }
        }

        if (!totalAcum > 0) {
            res.json({ status: "success", message: "No hubo nada para hacer" });
            return
        }
        try {
            await PurchaseService.create(purchaseDatail); // creo y persisto la compra
            const ticket = await createTicket(req.user.email, totalAcum); // creo el ticket
            res.json({ status: "success", ticket: ticket })
        }
        catch (error) {
            console.log(error);
            res.json({ error: "error", "message": error })
        }


        async function deductStock(pId, deductQantity) { // traigo y descuento stock
            let product = await ProductsService.getProductById(pId);
            product.stock -= deductQantity;
            try {
                await ProductsService.updateProduct(pId, product);
                console.log("Stock actualizado para el producto");

            } catch (error) {
                throw new Error(error)
            }
        }

        async function updateCart(cId, pId) { // borra del carrito el item cuyo producto sea el que le paso por id
            try {
                await CartsService.getByIdAndDeleteProd(cId, pId);
            }
            catch (error) {
                throw new Error(error)
            }
        };

        async function createTicket(email, total) {
            try {
                const ticket = await TicketService.create({ amount: total, purchaser: email })
            } catch (error) {
                console.log(error);
                throw new Error(error)
            }

        }

    }


}