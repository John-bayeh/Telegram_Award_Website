import express from "express";
import Category from "../models/Category.js";
import Vote from "../models/Vote.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// List all categories (handy for debugging / future use)
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a single category (+ its competitors and live vote counts) by slug
router.get("/:slug", async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get the authenticated user's vote for a category (null if not voted yet)
router.get("/:slug/my-vote", requireAuth, async (req, res) => {
  try {
    const vote = await Vote.findOne({
      userId: req.user.userId,
      categorySlug: req.params.slug,
    });
    res.json({ competitorId: vote ? vote.competitorId : null });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Cast a vote: body { competitorId }
// userId is taken from the verified JWT — same value used by GET /mine — guaranteeing persistence.
router.post("/:slug/vote", requireAuth, async (req, res) => {
  const { slug } = req.params;
  const { competitorId } = req.body;
  const userId = req.user.userId; // always use the JWT-verified id

  if (!competitorId) return res.status(400).json({ message: "competitorId is required" });

  try {
    const category = await Category.findOne({ slug });
    if (!category) return res.status(404).json({ message: "Category not found" });

    const competitor = category.competitors.id(competitorId);
    if (!competitor) return res.status(404).json({ message: "Competitor not found" });

    // Record the ballot first — duplicate key (E11000) means already voted here.
    try {
      console.log("[vote] saving vote with userId:", userId, "slug:", slug, "competitorId:", competitorId);
      await Vote.create({ userId, categorySlug: slug, competitorId });
    } catch (err) {
      if (err.code === 11000) {
        return res.status(409).json({ message: "You already voted in this category" });
      }
      throw err;
    }

    // Ballot accepted → increment the competitor's tally atomically.
    await Category.updateOne(
      { slug, "competitors._id": competitorId },
      { $inc: { "competitors.$.votes": 1 } }
    );

    res.json({
      message: `Voted for ${competitor.name}`,
      competitorId,
      votes: competitor.votes + 1
    });
  } catch (err) {
    console.error("❌ POST /vote error details:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
