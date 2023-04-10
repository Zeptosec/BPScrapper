import express from "express";
import { validatePassPhrase } from "../auth.js";
import { getPrices } from '../controllers/priceController.js';

const router = express.Router();
//require auth for all routes
router.use(validatePassPhrase);

router.get(`/getprices`, async (req, res) => {

    let prices = null;
    try {
        prices = await getPrices();
    } catch (err) {
        console.log(err);
    }

    if (prices) {
        res.status(200).json(prices);
    } else {
        res.status(500).send(`could not get prices`);
    }
})

router.get(`/collect`, async (req, res) => {
    let prices = null;
    try {
        prices = await getPrices();
    } catch (err) {
        console.log(err);
    }

    if (prices) {
        res.status(200).setHeader("Success", "saved").send();
    } else {
        res.status(500).setHeader("Failed", "failed to save").send();
    }
})

export default router;