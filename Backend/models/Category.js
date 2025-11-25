import mongoose from "mongoose";

// Competitor Schema
const competitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, required: true },
  link: { type: String, required: true },
  image: { type: String },
  votes: { type: Number, default: 0 } // matches frontend
});

// Category Schema
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  desc: { type: String, required: true },
  competitors: [competitorSchema] // array of competitors
});

const Category = mongoose.model("Category", categorySchema);
export default Category;
