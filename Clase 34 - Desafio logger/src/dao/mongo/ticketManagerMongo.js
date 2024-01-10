import { ticketModel } from "./models/ticket.model.js";

export class TicketManagerMongo{
    constructor(){
        this.model = ticketModel;
}


/* Crea ticket para finalizar una compra de carrito */
async create(newTicket) {
    try {
      return await this.model.create(newTicket);
    } catch (error) {
        throw new Error(error)
    }
}
async findById(tId) {
    try {
      return await this.model.findById(tId);
    } catch (error) {
        throw new Error("Error al recuperar el ticket")
    }
}

}