import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    properties: mongoose.Schema.Types.Mixed,
    unsubscribed: { type: Boolean, default: false }
},
    { timestamps: true }
);

const User = mongoose.model("User", userSchema);
export default User;