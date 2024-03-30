import { useState } from "react";
import Modal from "../components/Modal";
import BarrelListItem from "../components/barrel/BarrelListItem";
import useFetch from "../hooks/useFetch";
import AddNew from "../components/barrel/AddNew";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { Barrel } from "../@types/barrel";
import historyStyles from "../styles/history.module.css"
import serverBaseURL from "../utils/baseURL";


const ManageBarrels = () => {
  const { data, loading, error, refetch } = useFetch<Barrel[]>(`${serverBaseURL}/api/barrel/manage-all`);
  const [openNew, setOpenNew] = useState(false);
  if (loading) return <Loading />
  return (
    <div className={historyStyles.container}>
      <h1>Manage Barrels</h1>
      <p className="error">{ error }</p>
      <h2>Still under construction... <span className={"material-symbols-outlined"}>handyman</span></h2>
      <Button 
        title={"Add Barrels"}
        styleOverride={{ width: "12rem", height: "4rem" }}
        handleClick={() => {console.log("log");setOpenNew(true)}} />
      <Modal open={openNew} setOpen={setOpenNew} >
        <AddNew refetch={refetch} setOpen={setOpenNew} />
      </Modal>
      <h2>Existing Barrels:</h2>
      { data && data.map((b) => {
        return <BarrelListItem key={b._id} barrel={b} barrelNumbers={data.map((b) => b.number)} />
      }) } 
       
    </div>
  )
}

export default ManageBarrels