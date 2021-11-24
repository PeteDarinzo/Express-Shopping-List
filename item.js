const fs = require('fs');
const fsp = require('fs/promises');

class Item {

    constructor(name, price) {
        this.item = { name, price };
        this.addItem();
    }


    async addItem() {
        const data = await fsp.readFile('./groceryList.json')

        let list = JSON.parse(String(data));

        list.push(this.item);

        fs.writeFile('./groceryList.json', JSON.stringify(list), { encoding: 'utf8', flag: 'w' }, err => {
            if (err) {
                console.log(`Error writing to file`, err);
                process.kill(1)
            }
        });
    }


    static async getItem(name) {
        const data = await fsp.readFile('./groceryList.json')
        let list = JSON.parse(String(data));
        const item = list.find(i => i.name === name);
        return item;
    }


    static async updateItem(name, newName, newPrice) {
        const data = await fsp.readFile('./groceryList.json')
        let list = JSON.parse(String(data));
        const item = list.find(i => i.name === name);
        console.log(item);
        if (!item) return undefined;
        item.name = newName;
        item.price = newPrice;
        await fsp.writeFile('./groceryList.json', JSON.stringify(list))
        return item;
    }


    static async deleteItem(name) {
        const data = await fsp.readFile('./groceryList.json')
        let list = JSON.parse(String(data));
        const item = list.find(i => i.name === name);
        console.log(item);
        if (!item) return undefined;
        const index = list.indexOf(item);
        list.splice(index, 1);
        await fsp.writeFile('./groceryList.json', JSON.stringify(list))
        return "success";
    }
}

module.exports = Item;