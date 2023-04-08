import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    products: [{
        price: { type: Number, required: true },
        priceAfterDiscount: { type: Number, required: true },
        name: { type: String, required: true },
    }],
    location: { type: Number, required: true}
}, { timestamps: true })

export default mongoose.model('Product', productsSchema);