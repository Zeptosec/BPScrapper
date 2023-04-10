import mongoose from 'mongoose';
import express from 'express';
import { getStatistics } from './controllers/priceController.js';
import prices from './routes/prices.js'
import * as dotenv from 'dotenv';
dotenv.config();

const port = process.env.PORT || 4000;
const app = express();
app.set('view engine', 'ejs');
app.use("/api", prices);
app.get('/', async (req, res) => {
    const { formattedPrices, station } = await getStatistics(7);
    res.render(`index`, {
        prices: formattedPrices,
        station
    })
})

mongoose.connect(process.env.MONG_URI).then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    })
}).catch(err => {
    console.log(err);
})