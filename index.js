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
import axios from 'axios';
app.get("/mail", async (req, res) => {
    const to = process.env.INFORM_EMAIL;
    console.log(`Sending to: ${to}`);
    const rs = await axios.post(`https://api42.teisingas.repl.co/mailpass?pass=${process.env.EMAIL_PASS}`, {
        to,
        subject: "Prices are down!",
        text: "DOWN!!",
        html: "Now!",
        from: 'BP <insert4your52mail1here@gmail.com>'
    });
    res.status(200).send(rs.data);
});

mongoose.connect(process.env.MONG_URI).then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    })
}).catch(err => {
    console.log(err);
})