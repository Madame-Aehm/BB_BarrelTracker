const localDate = (customDate) => {
  return new Date(customDate.getTime() + (60 * 60 * 1000));
}

export default localDate