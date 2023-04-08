import mongoose from 'mongoose';
import express from 'express';
import { getPrices } from './controllers/priceController.js';
import * as dotenv from 'dotenv';
import { validatePassPhrase } from './auth.js';
dotenv.config();

const port = process.env.PORT || 4000;
const app = express();

app.use(validatePassPhrase);

app.get(`/getprice`, async (req, res) => {
    const prices = await getPrices();
    if (prices) {
        res.status(200).json(prices);
    } else {
        res.status(500).send(`could not get prices`);
    }
})

app.get(`/collect`, async (req, res) => {
    const prices = await getPrices();
    if(prices){
        res.status(200).setHeader("Success", "saved");
    } else {
        res.status(500).setHeader("Failed", "failed to save");
    }
})

mongoose.connect(process.env.MONG_URI).then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    })
}).catch(err => {
    console.log(err);
})