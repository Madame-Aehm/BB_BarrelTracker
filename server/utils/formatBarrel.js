const formatBarrelSimple = (barrel) => {
  const current = barrel.home ? null : barrel.history[0];
  return {
    _id: barrel._id,
    number: barrel.number,
    home: barrel.home,
    current
  }
}

export { formatBarrelSimple }