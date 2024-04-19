import express from 'express';
import mongoose from 'mongoose';
import connectDB from '../mongodb.js';

const router = express.Router();

connectDB();

const ProductSchema = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    sku: { type: Number, required: false },
    name: { type: String, required: false },
    type: { type: String, required: false },
    price: { type: Number, required: false },
    upc: { type: String, required: false },
    category: [{
        id: { type: String, required: true },
        name: { type: String, required: true }
    }],
    shipping: { type: Number, required: false },
    description: { type: String, required: false },
    manufacturer: { type: String, required: false },
    model: { type: String, required: false },
    url: { type: String, required: false },
    image: { type: String, required: false } 
}, { strict: false });


const ProductModel = mongoose.model('products', ProductSchema);


router.get("/getProds", async (request, response) => {
    try {
        const products = await ProductModel.find({});
        console.log("Products found:", products);

        response.json({ products: products });
    } catch (error) {
        response.status(500).send({ error });
    }
});


export default router;

