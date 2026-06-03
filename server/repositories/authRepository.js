import Auth from "../models/auth.js";

export const authRepository = {
  async getSingleton() {
    const docs = await Auth.find();
    return docs[0] ?? null;
  },

  async findById(id) {
    return Auth.findById(id);
  },

  async save(auth) {
    return auth.save();
  },
};
