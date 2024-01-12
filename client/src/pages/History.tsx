import historyStyles from '../styles/history.module.css'
import { Barrel } from "../@types/barrel";
import Loading from "../components/Loading";
import HistoryCard from "../components/history/HistoryCard";
import useFetch from "../hooks/useFetch"
import {  useNavigate, useParams } from "react-router-dom";
import Button from '../components/Button';
import ToTop from '../components/ToTop';


function History() {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, error, loading } = useFetch<Barrel>(id ? `${serverBaseURL}/api/barrel/history/${id}` : "");
  console.log(data, error, loading);

  if (!id) return <p>How did you get here...? 🧐</p>
  if (loading) return <Loading />
  if (data) return (
    <>
      <Button 
        styleOverride={{ width: "10rem", height: "4rem", alignSelf: "flex-start", margin: "1rem", marginBottom: "0" }}
        loading={false}
        title="Back"
        handleClick={() => navigate(-1)} />
      <h1>Barrel #{data.number}</h1>
      { data.open && <HistoryCard key={data.open._id} history={data.open} /> }
      <div className={historyStyles.container}>
        { (data.history && !data.history.length) && <p>No history</p> }
        { data.history && data.history.map((h) => {
          return <HistoryCard key={h._id} history={h} />
        }) }
      </div>
      <ToTop />
    </>
  )
}

export default History