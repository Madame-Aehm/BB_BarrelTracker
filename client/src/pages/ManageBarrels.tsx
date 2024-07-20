import { useState } from "react";
import Modal from "../components/Modal";
import BarrelListItem from "../components/barrel/BarrelListItem";
import useFetch from "../hooks/useFetch";
import AddNew from "../components/barrel/AddNew";
import Button from "../components/Button";
import Loading from "../components/Loading";
import { Barrel } from "../@types/barrel";
import { historyStyles } from "../styles/styles";
import serverBaseURL from "../utils/baseURL";
import ToTop from "../components/ToTop";


const ManageBarrels = () => {
  const { data, setData, loading, error, refetch } = useFetch<Barrel[]>(`${serverBaseURL}/api/barrel/manage-all`);
  const [open, setOpen] = useState(false);
  if (loading) return <Loading />
  return (
    <>
      <div className={historyStyles.container}>
        <h1>Manage Barrels</h1>
        <p className="error">{ error }</p>
        <Button 
          title="Add Barrels"
          styleOverride={{ width: "12rem", height: "4rem" }}
          handleClick={() => setOpen(true)} />
        <Modal open={open} setOpen={setOpen} >
          <AddNew refetch={refetch} open={open} setOpen={setOpen} />
        </Modal>
        <h2>Existing Barrels:</h2>
        { data && data.map((b) => {
          return <BarrelListItem key={b._id} barrel={b} barrelNumbers={data.map((b) => b.number)} setBarrels={setData} />
        }) } 
      </div>
      <ToTop />
    </>
  )
}

export default ManageBarrels