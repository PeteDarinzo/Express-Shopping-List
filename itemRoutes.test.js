process.env.NODE_ENV = "test";
const request = require("supertest");
const fs = require("fs");
const app = require("./app");
const fsp = require('fs/promises');


// test grocery item
let pickles = { name: "pickles", "price": 2 };

// initalize the JSON file as [ {testObject} ]
beforeEach(async () => {
    await fsp.writeFile('./groceryList.json', JSON.stringify([pickles]));

    // fs.writeFile('./groceryList.json', JSON.stringify([pickles]), { encoding: 'utf8', flag: 'w' }, function (err) {
    //     if (err) {
    //         console.log(`Error writing to path`, err);
    //         process.kill(1)
    //     }
    // });
});


/**
 * THEORY 
 * after each test, read the JSON file
 * reduce the length of the array to 0 (to negate any adding or updating of the test object)
 * then it will be ready for the next tests
 * 
 */

afterEach(async () => {

    const data = await fsp.readFile('./groceryList.json')
    let list = JSON.parse(String(data));

    list.length = 0;

    fsp.writeFile('./groceryList.json', JSON.stringify(list))


    // fs.readFile('./groceryList.json', 'utf8', (err, data) => {
    //     if (err) {
    //         console.log(`Error reading`, err);
    //         process.kill(1);
    //     }

    //     let list = JSON.parse(data);

    //     list.length = 0;

    //     fs.writeFile('./groceryList.json', JSON.stringify(list), { encoding: 'utf8', flag: 'w' }, function (err) {
    //         if (err) {
    //             console.log(`Error writing to path`, err);
    //             process.kill(1)
    //         }
    //     });
    // });
});


describe("GET /items", () => {
    test("Get all grocery items", async () => {
        const res = await request(app).get('/items');
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual([pickles]);
    });
});


describe("GET /items/:name", () => {
    test("Get grocery item by name", async () => {
        const res = await request(app).get(`/items/${pickles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ item: pickles });
    });

    test("Get nonexistant grocery item", async () => {
        const res = await request(app).get('/items/pikkles');
        expect(res.statusCode).toBe(404);
    });
});


describe("POST /items", () => {

    test("Create new grocery item", async () => {
        const res = await request(app).post('/items').send({ name: "tortillas", price: 2.50 });
        expect(res.statusCode).toBe(201);
        expect(res.body).toEqual({ added: { item: { name: "tortillas", price: 2.50 } } })
    });

    test("Create new grocery item without name", async () => {
        const res = await request(app).post('/items').send({ price: 2.50 });
        expect(res.statusCode).toBe(400);
    });

    test("Create new grocery item without price", async () => {
        const res = await request(app).post('/items').send({ name: "tortillas" });
        expect(res.statusCode).toBe(400);
    });
});


describe("PATCH /items:name", () => {
    test("Update an items name/price", async () => {
        const res = await request(app).patch(`/items/${pickles.name}`).send({ name: "cucumber", price: 0.99 });
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({
            "updated": {
                "name": "cucumber",
                "price": 0.99
            }
        })
    });

    test("Respond with 404 for invalid item", async () => {
        const res = await request(app).patch('/items/pikkles').send({ name: "cucumber", price: 0.99 });
        expect(res.statusCode).toBe(404);
    });

    test("Give bad patch data", async () => {
        const res = await request(app).patch(`/items/${pickles.name}`).send({ name: "cucumber" });
        expect(res.statusCode).toBe(400);
    });

    test("Give bad patch data", async () => {
        const res = await request(app).patch(`/items/${pickles.name}`).send({ price: 0.99 });
        expect(res.statusCode).toBe(400);
    });
});


describe("DELETE /items", () => {

    test("Delete an item", async () => {
        const res = await request(app).delete(`/items/${pickles.name}`);
        expect(res.statusCode).toBe(200);
        expect(res.body).toEqual({ message: "Deleted" })
    });

    test("Respond with 404 for invalid item", async () => {
        const res = await request(app).delete('/items/pikkles');
        expect(res.statusCode).toBe(404);
    });
});

