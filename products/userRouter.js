import express from 'express';
import ProductModel from '../mongodb/product.js';
import UserModel from '../mongodb/user.js';

const router = express.Router();

router.put('/add', async (req, res) => {
    console.log(`Entered add endpoint`);
    const email = req.body.email;
    console.log(email);

    try {
        const result = await UserModel.findOneAndUpdate(
            { email: email }, // find a document with matching email
            { type: "standard" },
            // { $push: { product: product } }, // add the product to the products array
            { new: true, upsert: true, setDefaultsOnInsert: true } // options
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

export default router;