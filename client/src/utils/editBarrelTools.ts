import { BrlHistory, ToUpdateEditBarrel } from "../@types/barrel";

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
    createdAt: "",
    retired: "",
    returned: ""
  }
  if (!toUpdate.number) {
    validationFail = true;
    validationObject.number = "Barrels need a number"
  }
  if (barrelNumbers.includes(Number(toUpdate.number)) && myNum !== Number(toUpdate.number)) {
    validationFail = true;
    validationObject.number = `There is already a barrel number ${toUpdate.number}`
  }
  if (toUpdate.open) {
    if (!toUpdate.open.invoice) {
      validationFail = true;
      validationObject.invoice = "Invoice is required"
    }
    if (!toUpdate.open.createdAt) {
      validationFail = true;
      validationObject.createdAt = "Need to specify date"
    }
    if (toUpdate.damaged && !toUpdate.open.returned) {
      validationFail = true;
      validationObject.retired = "Barrel can't be retired with an open invoice"
    }
    if (toUpdate.open.returned && (new Date(toUpdate.open.returned).setHours(0,0,0,0) < new Date(toUpdate.open.createdAt).setHours(0,0,0,0))) {
      validationFail = true;
      validationObject.returned = "Barrel can't be returned before it is sent out"
    }
  }
  return { validationFail, validationObject }
}

const handleSetUpdate = (
  prev: ToUpdateEditBarrel, 
  name: string, 
  value: string | number | boolean,
  open: boolean,
  damage_review?: boolean) => {
  return open && prev.open ?
    damage_review && prev.open.damage_review ? {
      ...prev,
      open: {
        ...prev.open,
        damage_review: {
          ...prev.open.damage_review,
          [name]: value
        }
      }
    } : {
      ...prev,
      open: {
        ...prev.open,
        [name]: value
      }
    } : {
      ...prev,
      [name]: value
    }
}

const handleHistoryUpdate = (
  prev: BrlHistory, 
  name: string, 
  value: string | number | boolean,
  damage_review?: boolean) => {
  return damage_review && prev.damage_review ? {
      ...prev,
      damage_review: {
        ...prev.damage_review,
        [name]: value
      }
    } : {
      ...prev,
      [name]: value
    }
  
}

export { convertValueTypes, validateEditBarrel, handleSetUpdate, handleHistoryUpdate }