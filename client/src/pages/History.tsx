import historyStyles from '../styles/history.module.css'
import { Barrel, SendParamsType } from "../@types/barrel";
import Loading from "../components/Loading";
import HistoryCard from "../components/history/HistoryCard";
import useFetch from "../hooks/useFetch"
import { useNavigate, useOutletContext } from "react-router-dom";
import Button from '../components/Button';
import ToTop from '../components/ToTop';


function History() {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const { params } = useOutletContext<SendParamsType>();
  const navigate = useNavigate();

  const { data, error, loading } = useFetch<Barrel>(`${serverBaseURL}/api/barrel/history/${params}`);

  if (error) return <div>Something went wrong....</div>
  if (loading) return <Loading />
  if (data) return (
    <>
      <Button 
        styleOverride={{ width: "10rem", height: "4rem", alignSelf: "flex-start", margin: "1rem", marginBottom: "0" }}
        loading={false}
        title="Back"
        handleClick={() => navigate(-1)} />
      <h1>Barrel #{data.number}</h1>
      { (data.history && !data.history.length && !data.open) && <p>No history</p> }
      { data.open && <HistoryCard key={data.open._id} history={data.open} /> }
      <div className={historyStyles.container}>
        { data.history && data.history.map((h) => {
          return <HistoryCard key={h._id} history={h} />
        }) }
      </div>
      <ToTop />
    </>
  )
}

export default History