const shiftFocus = (id: number) => {
  const nextInput = document.getElementById(`${id + 1}`);
  nextInput?.focus();
}

export default shiftFocus