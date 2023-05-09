import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
    email: { type: String, required: true },
    receiving: { type: Boolean, required: true },
}, { timestamps: true });

export default mongoose.model('Subscriber', subscriberSchema);
