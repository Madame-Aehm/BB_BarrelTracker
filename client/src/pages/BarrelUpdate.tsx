import { useLocation, useNavigate, useParams } from 'react-router-dom'
import layoutStyles from '../styles/layout.module.css'
import barrelStyles from '../styles/barrel.module.css'
import useFetch from '../hooks/useFetch';
import { Barrel } from '../@types/barrel';
import formatDate from '../utils/formatDate';
import SendOut from '../components/barrel/SendOut';
import Loading from '../components/Loading';
import Return from '../components/barrel/Return';
import Button from '../components/Button';

const BarrelUpdate = () => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const navigate = useNavigate();
  const location = useLocation();
  const params = useParams();

  const url = `${serverBaseURL}/api/barrel/${location.state === "scanner" ? "id" : "number"}/${params.brl ? params.brl : ""}`;

  const { data: barrel, loading, setLoading, error, setError } = useFetch<Barrel>(url);

  if (loading) return <Loading />
  if (!barrel && error) return <p>{error}</p>
  return (
    <main className={`${layoutStyles.main} ${layoutStyles.trueCenter}`}>
      {(barrel && !barrel.damaged) && (
        <>
          <h1>Barrel #{ barrel.number }</h1>
          { !barrel.open 
          ? <h2 className={barrelStyles.rbm}>Send to:</h2> 
          : <div className={barrelStyles.displayCurrent}>
              <h3>Customer: </h3>
              <p>{ barrel.open.customer }</p> 
              <h3>Invoice: </h3>
              <p>{ barrel.open.invoice }</p>
              <h3>Since: </h3> 
              <p>{ formatDate(barrel.open.createdAt) }</p>
            </div>
          }
          <p className="error">{ error }</p>
          { barrel.open ? <Return 
                barrel={barrel}
                open={barrel.open}
                loading={loading}
                setLoading={setLoading}
                setError={setError} />
            : <SendOut 
                barrel={barrel}
                loading={loading} 
                setLoading={setLoading}
                setError={setError} />
          }
        </>
      )}
      { (barrel && barrel.damaged) && (
        <div>
          <h1>Barrel #{ barrel.number }</h1>
          <h4 >Barrel is marked as <span className='error'>damaged</span>. Don't use!</h4>
          <Button 
            loading={false}
            title='OK'
            styleOverride={{ width: "10rem", height: "4rem" }}
            handleClick={() => navigate("/") } />
        </div>
      ) }
    </main>
  )
}

export default BarrelUpdate