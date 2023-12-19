import { ticketDao } from "../dao/factory.js";

export class TicketService {

    
    static create(newTicket) {
        try {
          return  ticketDao.create(newTicket);
        } catch (error) {
            throw new Error(error)
        }
    }
    static findById(tId) {
        try {
          return  usersDao.findById(tId);
        } catch (error) {
            throw new Error(error)
        }
    }
    
}