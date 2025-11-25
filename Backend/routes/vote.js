import express from "express";
import Category from "../models/Category.js";

const router = express.Router();

// Vote for a competitor
router.post("/:categoryId/vote/:competitorId", async (req, res) => {
  try {
    const category = await Category.findById(req.params.categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const competitor = category.competitors.id(req.params.competitorId);
    if (!competitor) return res.status(404).json({ message: "Competitor not found" });

    competitor.votes += 1;
    await category.save();

    res.json({ message: `Voted for ${competitor.name}`, competitor });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
