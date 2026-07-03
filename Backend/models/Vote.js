import mongoose from "mongoose";

// One ballot per user per category. The unique compound index enforces
// "one vote per person per category" atomically at the DB layer, so a
// duplicate insert throws E11000 instead of racing on a read-then-write.
const voteSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    categorySlug: { type: String, required: true },
    competitorId: { type: mongoose.Schema.Types.ObjectId, required: true }
  },
  { timestamps: true }
);

voteSchema.index({ userId: 1, categorySlug: 1 }, { unique: true });

const Vote = mongoose.model("Vote", voteSchema);
export default Vote;
