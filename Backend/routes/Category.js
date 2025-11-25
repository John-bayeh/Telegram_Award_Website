import express from 'express';
import Category from '../models/Category.js';
import User from '../models/User.js'; // Make sure you have this model
const router = express.Router();

// Get a single category by ID or name
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    let category;
    if (/^[0-9a-fA-F]{24}$/.test(id)) {
      category = await Category.findById(id);
    }
    if (!category) {
      category = await Category.findOne({ name: id });
    }

    if (!category) return res.status(404).json({ message: "Category not found" });

    res.json(category);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// Vote for a competitor with user check
router.post("/:categoryId/vote/:competitorId/:userId", async (req, res) => {
  const { categoryId, competitorId, userId } = req.params;

  try {
    const category = await Category.findById(categoryId);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const competitor = category.competitors.id(competitorId);
    if (!competitor) return res.status(404).json({ message: "Competitor not found" });

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Check if user already voted in this category
    if (user.votes.get(categoryId)) {
      return res.status(400).json({ message: "You already voted in this category" });
    }

    // Increment vote
    competitor.votes += 1;
    await category.save();

    // Save user's vote
    user.votes.set(categoryId, competitorId);
    await user.save();

    res.json({ message: `Voted for ${competitor.name}`, competitor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
