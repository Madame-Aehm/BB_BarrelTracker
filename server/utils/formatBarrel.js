const formatBarrelSimple = (barrel) => {
  let current = null;
  if (barrel.history[0]) { 
    if (barrel.history[0].damage_review) { 
      current = barrel.history[0].damage_review.checked === false ? barrel.history[0] : null;
    }
  }
  return {
    _id: barrel._id,
    number: barrel.number,
    home: barrel.home,
    damaged: barrel.damaged,
    current
  }
}

export { formatBarrelSimple }