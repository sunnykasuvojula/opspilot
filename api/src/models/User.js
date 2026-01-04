import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      unique: true,
      required: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, select: false, required: true },
    role: { type: String, enum: ["ADMIN", "MEMBER", "VIEWER"], default: "MEMBER" },
  },
  { timestamps: true }
);
userSchema.methods.comparePassword = async function (plainPassword) {
  return bcrypt.compare(plainPassword, this.passwordHash);
};

userSchema.statics.hashPassword = async function (plainPassword) {
  return bcrypt.hash(plainPassword, 10);
};

// Optional (redundant but fine)
userSchema.pre("save", function (next) {
  if (this.email) this.email = this.email.toLowerCase().trim();
  next();
});

export default mongoose.model("User", userSchema);


/*This version:

✅ Supports login

✅ Prevents duplicate emails

✅ Supports roles

✅ Auto-adds createdAt, updatedAt*/