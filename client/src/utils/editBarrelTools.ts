import { ToUpdateEditBarrel } from "../components/barrel/EditBarrel"

const convertValueTypes = (value: string, name: string) => {
  console.log(typeof value);
  let result: string | number | boolean = value;
  if (name === "number" && value) result = Number(value);
  if (name === "damaged") result = value === "true";
  if (value && (name === "createdAt" || name === "returned")) result = new Date(value).toJSON();
  return result
}

const validateEditBarrel = (toUpdate: ToUpdateEditBarrel, barrelNumbers: number[], myNum: number) => {
  let validationFail = false;
  const validationObject = {
    number: "",
    invoice: "",
    createdAt: ""
  }
  if (!toUpdate.number) {
    validationFail = true;
    validationObject.number = "Barrels need a number"
  }
  if (barrelNumbers.includes(Number(toUpdate.number)) && myNum !== Number(toUpdate.number)) {
    validationFail = true;
    validationObject.number = `There is already a barrel number ${toUpdate.number}`
  }
  if (toUpdate.open && !toUpdate.open.invoice) {
    validationFail = true;
    validationObject.invoice = "Invoice is required"
  }
  if (toUpdate.open && !toUpdate.open.createdAt) {
    validationFail = true;
    validationObject.createdAt = "Need to specify date"
  }
  return { validationFail, validationObject }
}

export { convertValueTypes, validateEditBarrel }