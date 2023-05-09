import mongoose from 'mongoose';
import express from 'express';
import { getStatistics } from './controllers/priceController.js';
import prices from './routes/prices.js'
import * as dotenv from 'dotenv';
import { subscribe, unsubscribe } from './controllers/subscriberController.js';
dotenv.config();

const port = process.env.PORT || 4000;
const app = express();
app.set('view engine', 'ejs');
app.use(express.json());
app.use("/api", prices);
app.get('/', async (req, res) => {
    const { formattedPrices, station } = await getStatistics(7 * 4);
    res.render(`index`, {
        prices: formattedPrices,
        station
    })
})

app.post('/subscribe', async (req, res) => {
    const { email } = req.body;
    try {
        const rs = await subscribe(email);
        if (rs.success) {
            res.status(200).json({ msg: rs.msg });
        } else {
            res.status(400).json({ msg: rs.msg });
        }
    } catch (rr) {
        res.status(500).json({ msg: rr.message });
    }
})

app.post('/unsubscribe', async (req, res) => {
    const { email } = req.body;
    try {
        const rs = await unsubscribe(email);
        if (rs.success) {
            res.status(200).json({ msg: rs.msg });
        } else {
            res.status(400).json({ msg: rs.msg });
        }
    } catch (rr) {
        res.status(500).json({ msg: rr.message });
    }
})

mongoose.connect(process.env.MONG_URI).then(() => {
    app.listen(port, () => {
        console.log(`Listening on port ${port}!`);
    })
}).catch(err => {
    console.log(err);
})