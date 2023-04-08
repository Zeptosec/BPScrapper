import mongoose from "mongoose";

const tokenModel = new mongoose.Schema({
    jwt: {
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
}, { timestamps: true });

export default mongoose.model("Token", tokenModel);