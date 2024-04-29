import express from 'express';
// import ProductModel from '../mongodb/product.js';
import UserModel from '../mongodb/user.js';

const router = express.Router();

router.put('/add', async (req, res) => {
    const { email, productID, productName, productPrice, productShipping } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Check if the product already exists
        const productExists = user.product.find(p => p.id === productID);

        if (productExists) {
            // If product exists, increment the quantity
            await UserModel.findOneAndUpdate(
                { email: email, "product.id": productID },
                { $inc: { "product.$.quantity": 1 } }
            );
        } else {
            // If product does not exist, add it with quantity set to 1
            await UserModel.findOneAndUpdate(
                { email: email },
                { $push: { product: { id: productID, name: productName, price: productPrice, shipping: productShipping, quantity: 1 } } }
            );
        }

        res.json({
            message: 'Product updated or added successfully'
        });
    } catch (error) {
        console.error('Failed to add or update product:', error);
        res.status(500).json({ error: error.message });
    }
});


router.post('/remove', async (req, res) => {
    const { email, productID } = req.body;

    try {
        const user = await UserModel.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        // Check if the product exists and quantity
        const product = user.product.find(p => p.id === productID);
        if (!product) {
            return res.status(404).json({ success: false, message: "Product not found." });
        }

        if (product.quantity > 1) {
            // Decrement the quantity by 1
            await UserModel.findOneAndUpdate(
                { email: email, "product.id": productID },
                { $inc: { "product.$.quantity": -1 } }
            );
        } else {
            // Remove the product from the list
            await UserModel.findOneAndUpdate(
                { email: email },
                { $pull: { product: { id: productID } } }
            );
        }

        res.json({
            message: 'Product quantity decremented or product removed successfully'
        });
    } catch (error) {
        console.error('Failed to remove product:', error);
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

        // Calculate the total price of all products, considering the quantity
        if (user.product && user.product.length > 0) {
            totalPrice = user.product.reduce((acc, curr) => {
                // Calculate product total based on price and quantity and shipping
                const productTotal = (curr.price || 0) * (curr.quantity || 1); // Use || 1 to default quantity to 1 if undefined or zero
                
                // Check if there is a shipping cost and add it to the total price (not multiplied by quantity)
                const shippingCost = curr.shipping > 0 ? curr.shipping : 0;

                return acc + productTotal + shippingCost;
            }, 0);
        }

        // Round the total price to two decimal places
        totalPrice = parseFloat(totalPrice.toFixed(2));
        
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