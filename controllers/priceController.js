import axios from 'axios';
import { getToken } from '../auth.js';
import pricesModel from '../models/pricesModel.js';
import { getFormattedHTML, getFormattedText } from './emailController.js';
import stationModel from '../models/stationModel.js';

async function savePrices(prices, location) {
    let station = await stationModel.findOne({ location });
    if (!station) {
        const productNames = prices.products.map(w => ({ name: w.name, id: w.id }));
        station = await stationModel.create({ productNames, location })
    }
    let products = [];
    for (let i = 0; i < prices.products.length; i++) {
        let prod = station.productNames.find(w => w.name === prices.products[i].name)
        if (!prod) {
            const newProd = { id: prices.products[i].id, name: prices.products[i].name };
            station.productNames = [...station.productNames, newProd];
            prod = newProd;
            await stationModel.updateOne({ location }, { productNames: station.productNames });
        }
        products.push({
            price: prices.products[i].price,
            priceAfterDiscount: prices.products[i].priceAfterDiscount,
            id: prod.id
        })
    }
    const curr = await pricesModel.create({ products, location, createdAt: new Date().getTime() });
    checkAndInform(curr, station);
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

async function sendInformationEmail(prev, curr, station) {
    const text = getFormattedText(prev, curr, station);
    const html = getFormattedHTML(prev, curr, station);
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

async function checkAndInform(prices, station) {
    const prev = await pricesModel.findOne({ location: prices.location }).sort({ _id: -1 }).skip(1);
    if(!prev) {
        console.log("prev not found");
        return;
    }
    // theres is a possibility that a new product may be added or old one removed
    if (prev.products.length !== prices.products.length) {
        console.log("products lengths dont match!")
        return;
    }

    if (prev.products[0].priceAfterDiscount > prices.products[0].priceAfterDiscount)
        sendInformationEmail(prev, prices, station);
}

export async function getStatistics(days) {
    const to = new Date();
    const from = new Date(new Date().getTime() - 24 * 60 * 60 * 1000 * days);
    const prices = await pricesModel.find({
        createdAt: { $gte: from, $lt: to },
        location: 179
    }).select('location createdAt products.priceAfterDiscount products.id -_id');
    const station = await stationModel.findOne({ location: 179 }).select('location, productNames.name productNames.id -_id');
    const formattedPrices = prices.map(w => ({ products: w.products, location: w.location, createdAt: w.createdAt }));
    return { formattedPrices, station };
}