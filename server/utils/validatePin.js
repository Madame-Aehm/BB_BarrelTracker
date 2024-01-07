const validatePin = (pin) => {
  if (pin.length !== 4) return false;
  let result = true;
  for (let i = 0; i < pin.length; i++) {
    if (isNaN(parseInt(pin[i]))) {
      result = false;
      break;
    }
  }
  return result
}

export default validatePin