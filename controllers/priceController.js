import axios from 'axios';
import { getToken } from '../auth.js';
import pricesModel from '../models/pricesModel.js';
import { getFormattedHTML, getFormattedText } from './emailController.js';

async function savePrices(prices, location) {
    const products = prices.products.map(w => ({ price: w.price, priceAfterDiscount: w.priceAfterDiscount, name: w.name }))
    const curr = await pricesModel.create({ products, location });
    checkAndInform(curr);
}

export async function getPrices() {
    const token = await getToken();
    const priceApi = process.env.PRICES_API;
    if (token) {
        try {
            const rs = await axios.get(priceApi, { headers: { 'Authorization': `Bearer ${token}` } });
            const parts = priceApi.split('/')
            await savePrices(rs.data, parts[parts.length - 2]);
            return rs.data;
        } catch (err) {
            console.log(err);
        }
    }
    return null;
}

async function sendInformationEmail(prev, curr) {
    const text = getFormattedText(prev, curr);
    const html = getFormattedHTML(prev, curr);
    const to = process.env.INFORM_EMAIL;
    console.log(to);
    axios.post(`https://api42.teisingas.repl.co/mailpass?pass=${process.env.EMAIL_PASS}`, {
        to,
        subject: "Prices are down!",
        text,
        html,
        from: 'BP <insert4your52mail1here@gmail.com>'
    }).then(r => {
        console.log(r.data)
    });
}

async function checkAndInform(prices) {
    const prev = await pricesModel.findOne({ location: prices.location }).sort({ _id: -1 }).skip(1);
    // theres is a possibility that a new product may be added or old one removed
    if (prev.products.length !== prices.products.length) {
        console.log("products lengths dont match!")
        return;
    }

    if(prev.products[0].priceAfterDiscount > prices.products[0].priceAfterDiscount)
        sendInformationEmail(prev, prices);
    // for (let i = 0; i < prices.products.length; i++) {
    //     if (prev.products[i].priceAfterDiscount > prices.products[i].priceAfterDiscount) {
    //         // inform theres a discount

    //     } else {
    //         // did not change or increased
    //     }
    // }
}