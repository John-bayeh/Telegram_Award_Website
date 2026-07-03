import mongoose from "mongoose";

// Users authenticate either by Google (email) or by phone (Twilio Verify OTP).
// Both identifiers are optional but unique — `sparse` lets many docs omit one
// without colliding on null.
const userSchema = new mongoose.Schema(
  {
    email:    { type: String, unique: true, sparse: true },
    phone:    { type: String, unique: true, sparse: true },
    password: { type: String },
    isAdmin:  { type: Boolean, default: false },
    banned:   { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
