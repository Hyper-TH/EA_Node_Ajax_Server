import ProductModel from "../../../mongodb/product.js";

export const fetchDocumentByIndex = async (index) => {
    try {
      const documents = await ProductModel.find().sort({createdAt: 1}); // Sorting by creation time, for example
      if (index >= 0 && index < documents.length) {
        return documents[index]; // Returns the document at the specified index
      } else {
        throw new Error("Index out of bounds");
      }
    } catch (error) {
      console.error("Error fetching document by index:", error);
      return null;
    }
};