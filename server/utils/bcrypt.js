import bcrypt from "bcrypt";

export const encrypt = async(pin) => {
  try {
    const saltRounds = 10;
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPin = await bcrypt.hash(pin, salt);
    return hashedPin
  } catch(error) {
    console.log("Error: ", error);
  }
}

export const verify = async (pin, hashedPin) => {
  const verified = bcrypt.compare(pin, hashedPin);
  return verified;
};