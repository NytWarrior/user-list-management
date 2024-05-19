import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    properties: { type: Map, of: String },
    unsubscribed: { type: Boolean, default: false }
});

const ListSchema = new mongoose.Schema({
    title: { type: String, required: true },
    customProperties: [{ title: String, defaultValue: String }],
    users: [UserSchema]
});

const List = mongoose.model('List', ListSchema);
export default List;