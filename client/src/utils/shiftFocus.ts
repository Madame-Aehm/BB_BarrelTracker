const shiftFocus = (id: number) => {
  const nextInput = document.getElementById(`${id + 1}`);
  nextInput?.focus();
}

const unfocusAll = () => {
  const inputs = document.getElementsByTagName("input");
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].blur();
  }
}

export { shiftFocus, unfocusAll }