import { useContext, useState } from "react"
import { CustomerContext } from "../context/CustomerContext"
// import { Customer } from "../@types/customer";
import Button from "../components/Button";
import Modal from "../components/Modal";
import AddNew from "../components/customers/AddNew";


const ManageCustomers = () => {
  const { customers } = useContext(CustomerContext);
  const [open, setOpen] = useState(false);
  // const [editCustomer, setEditCustomer] = useState<null | Customer>(null);
  return (
    <>
      <h1>Manage Customers</h1>
      <h2 className={"material-symbols-outlined"}>handyman</h2>
      <Button 
        title="New +"
        styleOverride={{ width: "12rem", height: "4rem" }}
        handleClick={() => setOpen(true)} />

      { customers.map((customer) => {
        return <h5 key={customer._id}>{ customer.name }</h5>
      })}
      <Modal open={open} setOpen={setOpen}>
        <AddNew setOpen={setOpen} open={open} />
      </Modal>
    </>
  )
}

export default ManageCustomers