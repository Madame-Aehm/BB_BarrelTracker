import Session from "../models/session.js";

export const sessionRepository = {
  async create({ userId, sessionId, refreshToken }) {
    return Session.create({ userId, sessionId, refreshToken });
  },

  async findBySessionId(sessionId) {
    return Session.findOne({ sessionId });
  },

  async updateRefreshHash(sessionId, refreshTokenHash) {
    return Session.updateOne({ sessionId }, { $set: { refreshToken: refreshTokenHash } });
  },

  async deleteBySessionId(sessionId) {
    return Session.deleteOne({ sessionId });
  },
};
