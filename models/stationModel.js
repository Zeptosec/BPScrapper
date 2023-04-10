import mongoose from "mongoose";

const stationsSchema = new mongoose.Schema({
    productNames: [{
        name: { type: String, required: true },
        id: { type: Number, required: true }
    }],
    location: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Station', stationsSchema);
