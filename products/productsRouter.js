import express from 'express';
import ProductModel from '../mongodb/product.js';
import { countTotalDocuments } from './components/countTotalDocuments.js';
import { findDocIndex } from './components/findDocIndex.js'
import { fetchDocumentByIndex } from './components/fetchDocumentByIndex.js';

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
            index = 0;

            if (!product) {
                return res.status(404).json({ message: "No products found" });
            }

        }

        total = await countTotalDocuments();

        res.json({ product: product, total: total, index: index});
    } catch (error) {
        console.error("Error accessing the database:", error);
        res.status(500).send({ error: error.message });
    }
});

router.get("/getItem", async (req, res) => {
    const index = req.query.index;
    try {
        console.log(`Got: `, index);

        const product = await fetchDocumentByIndex(index);

        if (product) {
            const total = await countTotalDocuments();
            res.json({ product: product, total: total, index: index })
        } else {
            return res.status(404).json({ message: "No products found" });
        }

    } catch (error) {
        console.error("Error accessing the database:", error);
        res.status(500).send({ error: error.message });
    }
})

router.get("/addProd", async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).send({ error })
    }
});

router.put("/editProd", async (req, res) => {
    console.log(`Received request of updating a product`);
    const { id, name, manufacturer, price } = req.body;
    
    try {
        const updatedProd = await ProductModel.findByIdAndUpdate(
            id,
            { $set: { name: name, manufacturer: manufacturer, price: price } },
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

router.put('/deleteProd', async (req, res) => {
    const { id } = req.body;

    try {
        const deletedProduct = await ProductModel.findByIdAndDelete(id);

        if (deletedProduct) {
            res.json({ success: true, message: "Product deleted successfully", data: deletedProduct });
        } else {
            // No document found with the given ID
            res.status(404).json({ success: false, message: "Product not found" });
        }
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: error.message });
    }
});


export default router;