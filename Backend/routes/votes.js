import express from "express";
import Vote from "../models/Vote.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// GET /api/votes/mine — returns { [categorySlug]: competitorId } for the logged-in user
router.get("/mine", requireAuth, async (req, res) => {
  try {
    console.log("[votes/mine] userId from JWT:", req.user.userId);
    const votes = await Vote.find({ userId: String(req.user.userId) });
    console.log("[votes/mine] found votes:", votes.length, votes.map(v => ({ slug: v.categorySlug, userId: v.userId })));
    // Shape: { tech: "64abc...", sport: "64def...", ... }
    const map = {};
    votes.forEach(v => { map[v.categorySlug] = v.competitorId.toString(); });
    console.log("[votes/mine] returning map:", map);
    res.json(map);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
