import mongoose from 'mongoose';
import localDate from '../utils/localDate.js';

const damageReviewSchema = new mongoose.Schema({
  comments: { type: String },
  closed: { type: Date },
  response: { type: String },
  images: [{ 
    public_id: { type: String, required: true },
    url: { type: String, required: true }
   }]
}, { timestamps: true })

const historySchema = new mongoose.Schema({  
  customer: { type: String, required: true },
  invoice: { type: String, required: true },
  returned: { type: Date },
  damage_review: damageReviewSchema,
  createdAt: { type: Date, default: localDate(new Date()) }
});

const barrelSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true}, 
  open: historySchema,
  history: [historySchema],
  damaged: { type: Boolean, required: true },

}, { timestamps: true });

export default mongoose.model("barrel", barrelSchema);