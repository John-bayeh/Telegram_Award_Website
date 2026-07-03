import mongoose from "mongoose";

// Competitor Schema
const competitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, default: "" },
  link: { type: String, default: "" },
  imageKey: { type: String, default: "" }, // frontend maps this to a bundled asset
  votes: { type: Number, default: 0 } // matches frontend
});

// Category Schema
const categorySchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true }, // stable key used by the frontend route
  name: { type: String, required: true },
  desc: { type: String, required: true },
  competitors: [competitorSchema] // array of competitors
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
