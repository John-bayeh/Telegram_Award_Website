import express from "express";
import Category from "../models/Category.js";
import Vote from "../models/Vote.js";
import User from "../models/User.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(requireAuth, requireAdmin);

// ─── DASHBOARD STATS ──────────────────────────────────────────────────────────

// GET /api/admin/stats — total votes, users, categories
router.get("/stats", async (req, res) => {
  try {
    const [totalVotes, totalUsers, totalCategories] = await Promise.all([
      Vote.countDocuments(),
      User.countDocuments(),
      Category.countDocuments(),
    ]);
    res.json({ totalVotes, totalUsers, totalCategories });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/admin/recent-votes — get the last 10 votes cast with populated details
router.get("/recent-votes", async (req, res) => {
  try {
    const votes = await Vote.find()
      .sort({ createdAt: -1 })
      .limit(10);

    const populated = await Promise.all(
      votes.map(async (v) => {
        let email = "Unknown User";
        try {
          const user = await User.findById(v.userId).select("email");
          if (user) email = user.email;
        } catch (_) {}

        let categoryName = v.categorySlug;
        let competitorName = "Unknown Competitor";
        try {
          const category = await Category.findOne({ slug: v.categorySlug });
          if (category) {
            categoryName = category.name;
            const competitor = category.competitors.id(v.competitorId);
            if (competitor) competitorName = competitor.name;
          }
        } catch (_) {}

        return {
          _id: v._id,
          userEmail: email,
          categoryName,
          competitorName,
          createdAt: v.createdAt,
        };
      })
    );
    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ─── CATEGORIES ───────────────────────────────────────────────────────────────

// GET /api/admin/categories — all categories with full data
router.get("/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/admin/categories — create a new category
router.post("/categories", async (req, res) => {
  const { slug, name, desc } = req.body;
  if (!slug || !name || !desc) {
    return res.status(400).json({ message: "slug, name, and desc are required" });
  }
  try {
    const category = await Category.create({ slug, name, desc, competitors: [] });
    res.status(201).json(category);
  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ message: "Slug already exists" });
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/categories/:id — update category name/desc/slug
router.put("/categories/:id", async (req, res) => {
  try {
    const { name, desc, slug } = req.body;
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { ...(name && { name }), ...(desc && { desc }), ...(slug && { slug }) },
      { new: true }
    );
    if (!category) return res.status(404).json({ message: "Category not found" });
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/categories/:id — delete category + its votes
router.delete("/categories/:id", async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });
    await Vote.deleteMany({ categorySlug: category.slug });
    res.json({ message: "Category and its votes deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── COMPETITORS ──────────────────────────────────────────────────────────────

// POST /api/admin/categories/:id/competitors — add competitor
router.post("/categories/:id/competitors", async (req, res) => {
  try {
    const { name, username, imageKey, link } = req.body;
    if (!name) return res.status(400).json({ message: "name is required" });

    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.competitors.push({ name, username: username || "", imageKey: imageKey || "", link: link || "", votes: 0 });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/categories/:id/competitors/:cid — edit competitor
router.put("/categories/:id/competitors/:cid", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    const competitor = category.competitors.id(req.params.cid);
    if (!competitor) return res.status(404).json({ message: "Competitor not found" });

    const { name, username, imageKey, link } = req.body;
    if (name) competitor.name = name;
    if (username !== undefined) competitor.username = username;
    if (imageKey !== undefined) competitor.imageKey = imageKey;
    if (link !== undefined) competitor.link = link;

    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/admin/categories/:id/competitors/:cid — remove competitor
router.delete("/categories/:id/competitors/:cid", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.competitors.pull({ _id: req.params.cid });
    await category.save();
    res.json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── VOTES ────────────────────────────────────────────────────────────────────

// DELETE /api/admin/categories/:id/votes — reset votes for a category
router.delete("/categories/:id/votes", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Zero out all competitor vote counts
    category.competitors.forEach(c => { c.votes = 0; });
    await category.save();
    await Vote.deleteMany({ categorySlug: category.slug });

    res.json({ message: `Votes reset for "${category.name}"` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ─── USERS ────────────────────────────────────────────────────────────────────

// GET /api/admin/users — list all users
router.get("/users", async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/ban — toggle ban
router.put("/users/:id/ban", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.banned = !user.banned;
    await user.save();
    res.json({ message: `User ${user.banned ? "banned" : "unbanned"}`, banned: user.banned });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT /api/admin/users/:id/make-admin — grant/revoke admin
router.put("/users/:id/make-admin", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    user.isAdmin = !user.isAdmin;
    await user.save();
    res.json({ message: `Admin ${user.isAdmin ? "granted" : "revoked"}`, isAdmin: user.isAdmin });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
