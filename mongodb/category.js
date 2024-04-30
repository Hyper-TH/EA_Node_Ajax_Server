import mongoose from 'mongoose';

const PathSchema = new mongoose.Schema({
    id: { type: String, required: false },
    name: { type: String, required: false }
});

const SubCategorySchema = new mongoose.Schema({
    id: { type: String, required: false },
    name: { type: String, required: false }
});

const CategorySchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    path: [PathSchema],  // An array of path items
    subCategories: [SubCategorySchema]  // Referencing the same schema for nested categories
});

const CategoryModel = mongoose.model('categories', CategorySchema);

export default CategoryModel;