import { historyStyles } from '../styles/styles';
import { Barrel, SendParamsType } from "../@types/barrel";
import Loading from "../components/Loading";
import HistoryCard from "../components/history/HistoryCard";
import useFetch from "../hooks/useFetch"
import { useNavigate, useOutletContext } from "react-router-dom";
import Button from '../components/Button';
import ToTop from '../components/ToTop';
import serverBaseURL from '../utils/baseURL';


function History() {
  const { params } = useOutletContext<SendParamsType>();
  const navigate = useNavigate();

  const { data, setData, error, loading } = useFetch<Barrel>(`${serverBaseURL}/api/barrel/get/?${params}&history=true`);

  if (error) return <div>Something went wrong....</div>
  if (loading) return <Loading />
  if (data) return (
    <>
      <Button 
        styleOverride={{ width: "10rem", height: "4rem", alignSelf: "flex-start", margin: "1rem", marginBottom: "0" }}
        title="Back"
        handleClick={() => navigate(-1)} />
      <h1>Barrel #{data.number}</h1>
      { (data.history && !data.history.length && !data.open) && <p>No history</p> }
      <div className={historyStyles.container}>
        {/* { data.open && <>
          <h3 style={{ alignSelf: "flex-start", marginLeft: "10%" }}>Open:</h3>
          <HistoryCard key={data.open._id} history={data.open} brl={data.number} brlHasOpen={data.open ? true : false} />
        </> } */}
        { data.history && <>
          { data.history.length > 0 && <h3 style={{ alignSelf: "flex-start", marginLeft: "10%" }}>Previous:</h3>}
          { data.history.map((h) => {
            return <HistoryCard key={h._id} history={h} brl={data.number} setBrl={setData} brlHasOpen={data.open ? true : false} />
          }) }
        </> }
      </div>
      <ToTop />
    </>
  )
}

export default History