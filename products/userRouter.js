import express from 'express';
import ProductModel from '../mongodb/product.js';
import UserModel from '../mongodb/user.js';

const router = express.Router();

router.put('/add', async (req, res) => {
    const { email, productID, productName, productPrice } = req.body;

    try {
        const result = await UserModel.findOneAndUpdate(
            { email: email }, // query to find the document
            {
                $set: { type: "standard" }, // setting 'type' only if needed
                $push: { product: { id: productID, name: productName, price: productPrice } } // pushing to the 'product' array
            },
            {
                new: true,
                upsert: true,
                setDefaultsOnInsert: true
            }
        );

        res.json({
            message: 'User updated or created successfully',
            data: result
        });
    } catch (error) {
        console.error('Failed to add or update user:', error);
        res.status(500).json({ error: error.message });
    }

}); 

router.get('/getCart', async (req, res) => {
    const email = req.query.email;

    try {
        const user = await UserModel.findOne({ email: email });

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found with the given email." });
        }

        // Initialize total price
        let totalPrice = 0;

        // Calculate the total price of all products
        if (user.product && user.product.length > 0) {
            totalPrice = user.product.reduce((acc, curr) => acc + (curr.price || 0), 0);
        }

        // Return the products array and the total price
        res.json({
            success: true,
            products: user.product,
            totalPrice: totalPrice
        });
    } catch (error) {
        console.error('Failed to get list', error);
        res.status(500).json({ error: error.message });
    }
});

export default router;