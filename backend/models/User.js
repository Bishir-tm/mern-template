const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const UserSchema = new mongoose.Schema({
  fullname: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  pin: Number,
  bvn: Number,
  wallet: {
    balance: { type: Number, default: 0 },
  },
  role: { type: String, default: "user" },
  resetPasswordToken: { type: String },
  resetPasswordExpires: { type: Date },
});

// Password hashing before saving
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model("User", UserSchema);
