import express from 'express';
import ProductModel from '../mongodb/product.js';
import CategoryModel from '../mongodb/category.js';
import { countTotalDocuments } from './components/mongoUtils/countTotalDocuments.js';
import { findDocIndex } from './components/mongoUtils/findDocIndex.js'
import { fetchDocumentByIndex } from './components/mongoUtils/fetchDocumentByIndex.js';
import { generateSKU, generateUPC } from './components/randGenerator.js';
const router = express.Router();


router.get('/getProds', async (req, res) => {
    const input = req.query.input;
    const type = req.query.type; // assuming the SKU is passed as a query parameter

    if (type === "name") {
        try {
            // Using regex for partial matching on the name, case-insensitive
            const regex = new RegExp(input, 'i'); // 'i' makes it case insensitive
    
            // Find all products where the name field contains the substring `name`
            const products = await ProductModel.find({ name: { $regex: regex } });
    
            if (products.length > 0) {
                res.json({ success: true, products: products });
            } else {
                res.status(404).json({ success: false, message: "No products found with the given name substring" });
            }
        } catch (error) {
            console.error('Error retrieving products:', error);
            res.status(500).json({ error: error.message });
        }
    } else {
        try {
            // Find the product with the exact numeric SKU
            const product = await ProductModel.findOne({ sku: input });
            let results = [];
    
            if (product) {
                console.log(product);
                results.push(product);
    
                res.json({ success: true, products: results });
            } else {
                res.status(404).json({ success: false, message: "No product found with given SKU" });
            }
        } catch (error) {
            console.error('Error retrieving product:', error);
            res.status(500).json({ error: error.message });
        }
    }
    
});

router.get("/getProd", async (req, res) => {
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
    const { id, name, manufacturer, price, shipping } = req.body;
    
    try {
        const updatedProd = await ProductModel.findByIdAndUpdate(
            id,
            { $set: { name: name, manufacturer: manufacturer, price: price, shipping: shipping } },
            { new: true, runValidators: true }
        );

        if (updatedProd) {
            res.json({ success: true, message: "Product updated successfully", data: updatedProd });
        } else {
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

router.get('/getCategories', async (req, res) => {
    try {
        const categories = await CategoryModel.find({})
            .select('id name') // Select only the id and name fields
            .limit(10); // Limit to 10 documents

        res.json(categories);
    } catch (err) {
        console.error("Error fetching categories:", err);
        res.status(500).json({ message: "Failed to fetch categories", error: err.message });
    }
});

router.post('/addProduct', async (req, res) => {
    try {
        let sku = generateSKU();
        let upc = generateUPC();

        // Check uniqueness in the database
        let existingProduct = await ProductModel.findOne({
            $or: [
                { sku: sku },
                { upc: upc }
            ]
        });

        // Ensure uniqueness, regenerate again if found
        while (existingProduct) {
            sku = generateSKU();
            upc = generateUPC();

            existingProduct = await ProductModel.findOne({
                $or: [
                    { sku: sku },
                    { upc: upc }
                ]
            });    
        };

        // Create a new product with the unique SKU and UPC
        const newProduct = new ProductModel({
            _id: new mongoose.Types.ObjectId(), 
            sku: sku,
            upc: upc,
            name: req.body.name,
            type: req.body.type,
            price: req.body.price,
            category: req.body.category,
            shipping: req.body.shipping,
            description: req.body.description,
            manufacturer: req.body.manufacturer,
            model: req.body.model,
            url: req.body.url,
            image: req.body.image
        });

        // Save new product
        await newProduct.save();

        res.status(201).json({
            message: "Product added successfully!",
            product: newProduct
        });

    } catch (error) {
        console.error('Failed to add product', error);
        res.status(500).json({ error: error.message });
    }
});


export default router;