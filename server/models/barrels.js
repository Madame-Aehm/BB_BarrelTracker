import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({  
  customer: { type: String, required: true },
  invoice: { type: String, required: true },
  returned: { type: Date },
  damage_review: {
    type: Object, 
    opened: { type: Date, required: true },
    comments: { type: String },
    closed: { type: Date },
    response: { type: String }
  }
}, { timestamps: true });

const barrelSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true}, 
  open: historySchema,
  history: [historySchema],
  damaged: { type: Boolean, required: true },

}, { timestamps: true });

export default mongoose.model("barrel", barrelSchema);