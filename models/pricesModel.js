import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    products: [{
        price: { type: Number, required: true },
        priceAfterDiscount: { type: Number, required: true },
        id: { type: Number, required: true },
    }],
    location: { type: Number, required: true },
    createdAt: { type: Number, required: true }
})
export default mongoose.model('Prices', productsSchema);