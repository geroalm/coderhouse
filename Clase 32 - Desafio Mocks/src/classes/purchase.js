export class Purchase {
    constructor() {
      this.items = [];
      this.client = {};
    }

    get getItems(){
        return this.items;
    }

    set setItems(items){
        this.items = items
    }

    get getClient(){
        return this.client
    }

    set setClient(client){
        this.client = client
    }
  }