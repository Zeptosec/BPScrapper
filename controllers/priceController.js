import axios from 'axios';
import { getToken } from '../auth.js';
import pricesModel from '../models/pricesModel.js';

async function savePrices(prices, location) {
    const products = prices.products.map(w => ({ price: w.price, priceAfterDiscount: w.priceAfterDiscount, name: w.name }))
    await pricesModel.create({ products, location });
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