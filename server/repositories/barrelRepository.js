import Barrel from "../models/barrels.js";

export const barrelRepository = {
  async findById(id, projection) {
    return Barrel.findById(id, projection);
  },

  async findByNumber(number, projection) {
    return Barrel.findOne({ number }, projection);
  },

  async findAllSummary() {
    return Barrel.find({}, "-history").sort({ number: "desc" });
  },

  async findLabelIds() {
    return Barrel.find({}, "_id number").sort({ number: "asc" });
  },

  async findMaxNumber() {
    const barrels = await Barrel.find({}, "-history").sort({ number: "desc" });
    if (!barrels.length) return 0;
    return barrels.map((b) => b.number).sort((a, b) => b - a)[0];
  },

  async setOpen(id, sendTo) {
    return Barrel.findByIdAndUpdate(id, { open: sendTo }, { new: true, select: "_id" });
  },

  async returnBarrel(id, openEntry) {
    return Barrel.findByIdAndUpdate(
      id,
      {
        $push: { history: { $each: [openEntry], $position: 0 } },
        open: null,
      },
      { new: true, select: "_id" }
    );
  },

  async requestDamageReview(id, damageReview, returnedDate) {
    return Barrel.findByIdAndUpdate(
      id,
      {
        "open.damage_review": damageReview,
        "open.returned": returnedDate,
      },
      { new: true, select: "-history" }
    );
  },

  async reviewDamage(id, openEntry, damaged) {
    return Barrel.findByIdAndUpdate(
      id,
      {
        $push: { history: { $each: [openEntry], $position: 0 } },
        damaged,
        open: null,
      },
      { new: true, select: "_id number" }
    );
  },

  async updateById(id, edits, projection = "-history") {
    return Barrel.findByIdAndUpdate(id, { ...edits }, { new: true }).select(projection);
  },

  async closeOpenToHistory(id, open) {
    return Barrel.findByIdAndUpdate(
      id,
      {
        $push: { history: { $each: [{ ...open }], $position: 0 } },
        open: null,
      },
      { new: true, select: "-history" }
    );
  },

  async findByIdForMutation(id) {
    return Barrel.findById(id);
  },

  async createMany(count, startNumber) {
    const saves = [];
    for (let i = startNumber; i < startNumber + count; i++) {
      saves.push(
        new Barrel({
          number: i,
          damaged: false,
          open: null,
        }).save()
      );
    }
    return Promise.all(saves);
  },
};
