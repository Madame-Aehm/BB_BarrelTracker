import bcrypt from "bcrypt";

export const encryptPin = async(pin) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPin = await bcrypt.hash(pin, salt);
    return hashedPin
  } catch(error) {
    console.log("Error: ", error);
  }
}

export const verifyPin = async (pin, hashedPin) => {
  const verified = bcrypt.compare(pin, hashedPin);
  return verified;
};