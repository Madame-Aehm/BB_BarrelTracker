const formatBarrelSimple = (barrel) => {
  return {
    _id: barrel._id,
    number: barrel.number,
    current: barrel.current
  }
}

export { formatBarrelSimple }