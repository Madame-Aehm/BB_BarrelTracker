import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  active: { type: Boolean, required: true }
}, { timestamps: true });

export default mongoose.model("customer", schema);