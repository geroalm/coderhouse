export class CartsViewController{

    /* Obtiene todos los carritos */
   static  getCarts  = async (req, resp) => {
        try {
            const result = await CartsService.getCarts();
            resp.json({ status: "success", data: result });
        } catch (error) {
            resp.json({ status: "error", data: "Error al recuperar los carritos" });
        }
    }

    /* Obtiene un carrito */
    static getOne = async(req,res)=>{
        try {
            const id = req.params.cId;
            const cart = await CartsService.getCartById(id);
            const items = cart.itemsProducts;
            console.log("ítems: ",items);
            res.render("carts",{items:items});   
        } catch (error) {
            resp.send(error.message);
        }
        
    }
}