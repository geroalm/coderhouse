import { chatModel } from "./models/chat.model.js";

export class ChatManagerMongo {

    async addChatMessage(chat) {
        return await chatModel.create(chat)
    }

    async getChats(){
        return await chatModel.find();
    }
}