import ProductModel from "../../mongodb/product.js";
import mongoose from "mongoose";

export const findDocIndex = async(documentId) => {
    try {
        // Assuming documents have a 'createdAt' field you can sort by
        const documents = await ProductModel.find({}).sort({ createdAt: 1 }).exec();
  
        // Find the index of the document with the given ID
        const index = documents.findIndex(doc => doc._id.toString() === documentId.toString());
  
        return index; // This will be -1 if the document isn't found
    } catch (error) {
        console.error('Error finding document index:', error);

        return -1; // Return -1 or handle error appropriately
    }
}