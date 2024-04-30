import ProductModel from "../../../mongodb/product.js";
import mongoose from 'mongoose';

export const countTotalDocuments = async () => {
    try {
        const count = await ProductModel.countDocuments();
        
        console.log(`There are ${count} documents in the collection.`);

        return count;
    } catch (error) {
        console.error(`Error counting documents:`, error);

        return 0;
    }
};