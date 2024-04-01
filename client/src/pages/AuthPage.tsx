import authStyles from '../styles/auth.module.css'
import layoutStyles from '../styles/layout.module.css'
import { useContext, useState } from 'react';
import { AuthOK, NotOK, PinError } from '../@types/auth';
import AuthForm from '../components/auth/AuthForm';
import { AuthContext } from '../context/AuthContext';
import Loading from '../components/Loading';
import serverBaseURL from '../utils/baseURL';

const AuthPage = () => {
  const { setAuth, loading, setLoading } = useContext(AuthContext);
  const defaultError = { 1: false, 2: false, 3: false, 4: false, message: "" };
  const [error, setError] = useState<PinError>(defaultError);



  const submit = async(pin: string) => {
    setLoading(true);
    const body = new URLSearchParams();
    body.append("pin", pin);
    try {
      const response = await fetch(`${serverBaseURL}/api/auth/authenticate`, { body, method: "POST" });
      if (response.ok) {
        const result = await response.json() as AuthOK;
        localStorage.setItem("token", result.token);
        setTimeout(() => {
          setAuth(true);
          setLoading(false);
        }, 1000)
        return
      }
      const result = await response.json() as NotOK;
      setError({ 1: true, 2: true, 3: true, 4: true, message: result.error });
      setLoading(false);
    } catch (e) {
      const { message } = e as Error
      setError({ ...error, message: message });
      setLoading(false);
    }
  }

  if (loading) return <Loading />

  return (
    <main className={`${layoutStyles.main} ${layoutStyles.trueCenter}`}>
      <img src='/bb_bean.png' alt='Blaue Bohne' className={authStyles.bbImg} />
      <h1 className={authStyles.h1}>- BARREL TRACKER -</h1>
      <AuthForm submit={submit} loading={loading} error={{ error, setError, defaultError }} />
    </main>
  )
}

export default AuthPage