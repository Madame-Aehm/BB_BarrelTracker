import bcrypt from "bcrypt";

export const encrypt = async (pin) => {
  const saltRounds = 10;
  const salt = await bcrypt.genSalt(saltRounds);
  return bcrypt.hash(pin, salt);
};

export const verify = async (pin, hashedPin) => {
  return bcrypt.compare(pin, hashedPin);
};
