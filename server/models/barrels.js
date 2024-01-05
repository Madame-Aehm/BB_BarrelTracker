import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({  
  customer: { type: String, required: true },
  invoice: { type: String, required: true },
  returned: { type: Date },
  damage_review: {
    type: Object, 
    date: { type: Date, required: true },
    checked: { type: Boolean, required: true },
    comments: { type: String },
    response: { type: String }
  }
}, { timestamps: true });

const barrelSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true}, 
  home: { type: Boolean, required: true },
  history: [historySchema],
  damaged: { type: Boolean, required: true },

}, { timestamps: true });

export default mongoose.model("barrel", barrelSchema);