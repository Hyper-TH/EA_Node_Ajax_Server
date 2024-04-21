import express from 'express';
import ProductModel from '../mongodb/product.js';

const router = express.Router();


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