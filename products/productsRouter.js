import express from 'express';
import ProductModel from '../mongodb/product.js';
import { countTotalDocuments } from './components/countTotalDocuments.js';
import { findDocIndex } from './components/findDocIndex.js'

const router = express.Router();


router.get("/getProds", async (req, res) => {
    try {
        let product;
        let total;
        let index;
        if (req.query.id != "") {
            // If ID is provided, find by ID
            product = await ProductModel.findById(req.query.id);
            index = await findDocIndex(req.query.id);

            if (!product) {
                return res.status(404).json({ message: "Product not found" });
            }

        } else {
            // If no ID provided, return the first document
            product = await ProductModel.findOne();
            index = 1;

            if (!product) {
                return res.status(404).json({ message: "No products found" });
            }

        }

        total = await countTotalDocuments();

        console.log("Product found:", product);
        res.json({ product: product, total: total, index: index});
    } catch (error) {
        console.error("Error accessing the database:", error);
        res.status(500).send({ error: error.message });
    }
});

router.get("/addProd", async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({ error })
    }
});

router.put("/editProd", async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    try {
        const updatedProd = await ProductModel.findByIdAndUpdate(
            id,
            { $set: { name: name } },
            { new: true, runValidators: true }
        );

        if (updatedProd) {
            res.json({ success: true, message: "Product updated successfully", data: updatedProd });
        } else {
            // TODO: Send back appropriate data
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        res.status(500).send({ error })
    }
});

router.get("/deleteProd", async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({ error })
    }
});


export default router;