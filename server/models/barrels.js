import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true}, // alternative way of finding barrel since mongo ids are stupid long
  current: { 
    date: { type: Date, required: true },  // when barrel was sent out
    by: { type: String, required: true }, // who sent/received the barrel
    where: { type: String, required: true } // where the barrel currently is
   },
  history: [{   // array of previous barrel locations (max 5?) (exclude BB)
    where: { type: String, required: true }, // where the barrel was
    out: {
      date: { type: Date, required: true }, // date the barrel was sent there
      by: { type: String, required: true } // who sent it
    },
    returned: {
      date: { type: Date, required: true }, // date barrel was returned
      by: { type: String, required: true }  // who received it
    },
  }]
}, { timestamps: true });

export default mongoose.model("barrel", schema);