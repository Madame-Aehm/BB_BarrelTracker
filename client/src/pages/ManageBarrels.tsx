import { useState } from "react";
import { LabelType } from "../@types/labels";
import Modal from "../components/Modal";
import BarrelListItem from "../components/barrel/BarrelListItem";
import useFetch from "../hooks/useFetch";
import AddNew from "../components/barrel/AddNew";
import Button from "../components/Button";
import Loading from "../components/Loading";


const ManageBarrels = () => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const { data, loading, error, refetch } = useFetch<LabelType[]>(`${serverBaseURL}/api/barrel/label/all`);
  const [openNew, setOpenNew] = useState(false);
  if (loading) return <Loading />
  return (
    <div>
      <h1>Manage Barrels</h1>
      <p className="error">{ error }</p>
      <h2>Still under construction... <span className={"material-symbols-outlined"}>handyman</span></h2>
      <Button 
        loading={false}
        title={"Add Barrels"}
        styleOverride={{ width: "12rem", height: "4rem" }}
        handleClick={() => {console.log("log");setOpenNew(true)}} />
      <Modal open={openNew} setOpen={setOpenNew} >
        <AddNew refetch={refetch} setOpen={setOpenNew} />
      </Modal>
      <h2>Existing Barrels:</h2>
      { data && data.map((b) => {
        return <BarrelListItem key={b._id} barrel={b} />
      }) }  
    </div>
  )
}

export default ManageBarrels