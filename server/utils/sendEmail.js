import EmailService from "../services/emailService.js";

const emailService = new EmailService();

export const barrelDamagedEmail = (barrel, comments, images) =>
  emailService.sendDamageReviewEmail(barrel, comments, images);

export const recoverPinEmail = (code) => emailService.sendPinRecoveryEmail(code);
