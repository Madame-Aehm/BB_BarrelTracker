const customerAlphSort = (array) => {
  array.sort((a, b) => {
    const first = a.name.toLowerCase();
    const second = b.name.toLowerCase();
    return (first < second) ? -1 : (first > second) ? 1 : 0;
  })
}

export default customerAlphSort