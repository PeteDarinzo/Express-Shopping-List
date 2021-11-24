const express = require('express');
const ExpressError = require('./expressError');
// @ts-ignore
const router = new express.Router();
const fs = require('fs');
const Item = require('./item');


// return all items in the list
router.get('/', (req, res) => {
    fs.readFile('./groceryList.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file`, err);
        }
        return res.status(200).json(JSON.parse(data));
    });
});


// add a new item to the list
router.post('/', async (req, res, next) => {
    try {
        if (!req.body.name) throw new ExpressError("Name is required", 400);
        if (!req.body.price) throw new ExpressError("Price is required", 400);

        const name = req.body.name;
        const price = req.body.price;

        const newItem = new Item(name, price);
        await newItem.addItem()

        return res.status(201).json({ added: newItem });
    } catch (e) {
        return next(e);
    }
});


// get a particular item from the list
router.get('/:name', async (req, res, next) => {
    try {
        const item = await Item.getItem(req.params.name);
        if (!item) throw new ExpressError("Item not found", 404);
        res.status(200).json({ item });
    } catch (e) {
        return next(e);
    }
});


// update an item's name and/or price
router.patch('/:name', async (req, res, next) => {
    try {
        if (!req.body.name) throw new ExpressError("Name is required", 400);
        if (!req.body.price) throw new ExpressError("Price is required", 400);
        const newName = req.body.name;
        const newPrice = req.body.price;
        const item = await Item.updateItem(req.params.name, newName, newPrice);
        if (!item) throw new ExpressError("Item not found", 404);
        return res.status(200).json({ updated: item });
    } catch (e) {

        return next(e);
    }
});



// delete an item from the list
router.delete('/:name', async (req, res, next) => {
    try {
        const item = await Item.deleteItem(req.params.name);
        if (item === undefined) throw new ExpressError("Item not found", 404);
        return res.status(200).json({ message: "Deleted" });
    } catch (e) {
        return next(e);
    }
});


module.exports = router;