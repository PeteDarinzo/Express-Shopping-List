const express = require('express');
const ExpressError = require('./expressError');
// @ts-ignore
const router = new express.Router();
const fs = require('fs');


// return all items in the list
router.get('/', (req, res) => {
    fs.readFile('./groceryList.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file`, err);
            process.kill(1);
        }
        return res.status(200).json(JSON.parse(data));
    });
});


// add a new item to the list
router.post('/', (req, res, next) => {
    try {
        if (!req.body.name) throw new ExpressError("Name is required", 400);
        if (!req.body.price) throw new ExpressError("Price is required", 400);

        const name = req.body.name;
        const price = req.body.price;

        const item = { name, price };

        fs.readFile('./groceryList.json', "utf8", (err, data) => {
            if (err) {
                console.log("Error reading file", err);
                process.kill(1);
            }

            let list = JSON.parse(data);

            list.push(item);

            fs.writeFile('./groceryList.json', JSON.stringify(list), { encoding: 'utf8', flag: 'w' }, err => {
                if (err) {
                    console.log(`Error writing to file`, err);
                    process.kill(1)
                }
                return res.status(201).json({ added: item });
            });
        });
    } catch (e) {
        return next(e);
    }
});


// get a particular item from the list
router.get('/:name', (req, res, next) => {
    fs.readFile('./groceryList.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file`, err);
            process.kill(1);
        }
        try {
            let list = JSON.parse(data);
            const item = list.find(i => i.name === req.params.name);
            if (!item) throw new ExpressError("Item not found", 404);
            res.status(200).json({ item });
        } catch (e) {
            return next(e);
        }
    });
});


// update an item's name and/or price
router.patch('/:name', (req, res, next) => {
    fs.readFile('./groceryList.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file`, err);
            process.kill(1);
        }
        try {
            let list = JSON.parse(data);
            const item = list.find(i => i.name === req.params.name);

            if (!item) throw new ExpressError("Item not found", 404);
            if (!req.body.name) throw new ExpressError("Name is required", 400);
            if (!req.body.price) throw new ExpressError("Price is required", 400);

            item.name = req.body.name;
            item.price = req.body.price;

            fs.writeFile('./groceryList.json', JSON.stringify(list), { encoding: 'utf8', flag: 'w' }, err => {
                if (err) {
                    console.log(`Error writing to file`, err);
                    process.kill(1);
                }
                res.status(200).json({ updated: item });
            });
        } catch (e) {
            return next(e);
        }
    });
});

// delete an item from the list
router.delete('/:name', (req, res, next) => {

    fs.readFile('./groceryList.json', 'utf8', (err, data) => {
        if (err) {
            console.log(`Error reading file`, err);
            process.kill(1);
        }
        try {
            let list = JSON.parse(data);
            const item = list.find(i => i.name === req.params.name);
            if (!item) throw new ExpressError("Item not found", 404);
            const index = list.indexOf(item);
            list.splice(index, 1);
            fs.writeFile('./groceryList.json', JSON.stringify(list), { encoding: 'utf8', flag: 'w' }, function (err) {
                if (err) {
                    console.log(`Error writing to file`, err);
                    process.kill(1);
                }
                return res.status(200).json({ message: "Deleted" });
            });
        } catch (e) {
            return next(e);
        }
    });
});


module.exports = router;