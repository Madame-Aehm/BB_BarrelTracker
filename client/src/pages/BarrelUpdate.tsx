import { Link, useNavigate, useOutletContext } from 'react-router-dom'
import useFetch from '../hooks/useFetch';
import { Barrel, SendParamsType } from '../@types/barrel';
import SendOut from '../components/barrel/SendOut';
import Loading from '../components/Loading';
import Return from '../components/barrel/Return';
import Button from '../components/Button';
import serverBaseURL from '../utils/baseURL';

const BarrelUpdate = () => {
  const navigate = useNavigate();

  const { params } = useOutletContext<SendParamsType>();


  const url = `${serverBaseURL}/api/barrel/get/?${params}`;

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
            title='OK'
            styleOverride={{ width: "10rem", height: "4rem" }}
            handleClick={() => navigate("/") } />
        </div>
      )}
      <p><Link to={`/barrel/history/${barrel.number}`}>see history</Link></p>
    </>
  )
}

export default BarrelUpdate