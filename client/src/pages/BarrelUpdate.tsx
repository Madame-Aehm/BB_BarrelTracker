import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import useFetch from '../hooks/useFetch';
import { Barrel } from '../@types/barrel';
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

  const { data: barrel, loading, setLoading, error, setError } = useFetch<Barrel>(url, true);

  if (loading) return <Loading />
  if (!barrel && error) return <p>{error}</p>
  if (barrel) return (
    <>
      <h1>Barrel #{ barrel.number }</h1>
      {!barrel.damaged ? (
        <>
          { barrel.open ? (
            <Return 
              barrel={barrel}
              open={barrel.open}
              loading={loading}
              setLoading={setLoading}
              setError={setError} />
          ) : ( 
            <SendOut 
              barrel={barrel}
              loading={loading} 
              setLoading={setLoading}
              setError={setError} />
          )}
          <p className="error">{ error }</p>
        </>
      ) : (
        <div>
          <h4 >Barrel is marked as <span className='error'>damaged</span>. Don't use!</h4>
          <Button 
            loading={false}
            title='OK'
            styleOverride={{ width: "10rem", height: "4rem" }}
            handleClick={() => navigate("/") } />
        </div>
      )}
      <Link to={`/history/${barrel._id}`}>see history</Link>
    </>
  )
}

export default BarrelUpdate