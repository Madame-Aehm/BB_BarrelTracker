import { useLocation, useParams } from 'react-router-dom'
import layoutStyles from '../styles/layout.module.css'
import barrelStyles from '../styles/barrel.module.css'
import useFetch from '../hooks/useFetch';
import { Barrel } from '../@types/barrel';
import formatDate from '../utils/formatDate';
import SendOut from '../components/barrel/SendOut';
import Loading from '../components/Loading';
import Return from '../components/barrel/Return';

const BarrelUpdate = () => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const location = useLocation();
  const params = useParams();

  const url = `${serverBaseURL}/api/barrel/${location.state === "scanner" ? "id" : "number"}/${params.brl ? params.brl : ""}`;

  const { data: barrel, loading, setLoading, error, setError } = useFetch<Barrel>(url);

  if (loading) return <Loading />
  return (
    <main className={`${layoutStyles.main} ${layoutStyles.trueCenter}`}>
      { barrel && (
        <>
          <h1>Barrel #{ barrel.number }</h1>
          <div className={barrelStyles.displayCurrent}>
            <h2>Currently: </h2>
            { barrel.current.where === "BB" 
              ? <img src="/bb_cropped.png" alt='Home at Blaue Bohne' className={barrelStyles.atHomeImg} /> 
              : <h2>{ barrel.current.where }</h2> 
            }
            <h2>Since: </h2>
            <h2>{ formatDate(barrel.current.date) }</h2>
          </div>
          { barrel.current.where === "BB" 
            ? <SendOut 
                barrel={barrel}
                loading={loading} 
                setLoading={setLoading}
                setError={setError} />
            : <Return 
                barrel={barrel}
                loading={loading}
                setLoading={setLoading}
                setError={setError} />
          }
        </>
      ) }
      <div><p className={barrelStyles.error}>{ error }</p></div>
      
    </main>
  )
}

export default BarrelUpdate