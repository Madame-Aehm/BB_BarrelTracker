
import { Dispatch, useContext, useState } from 'react';
import { AuthOK, NotOK, PinError } from '../@types/auth';
import authStyles from '../styles/auth.module.css'
import AuthForm from '../components/auth/AuthForm';
import { AuthContext } from '../context/AuthContext';



const AuthPage = () => {
  const { setAuth } = useContext(AuthContext);

  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const defaultError = { 1: false, 2: false, 3: false, 4: false, message: "" };
  const [error, setError] = useState<PinError>(defaultError);

  const submit = async(pin: string, setLoading: Dispatch<React.SetStateAction<boolean>>) => {
    const body = new URLSearchParams();
    body.append("pin", pin);
    try {
      const response = await fetch(`${serverBaseURL}/api/auth/authenticate`, { body, method: "POST" });
      if (response.ok) {
        const result = await response.json() as AuthOK;
        localStorage.setItem("token", result.token);
        setAuth(true);
        return
      }
      const result = await response.json() as NotOK;
      setError({ 1: true, 2: true, 3: true, 4: true, message: result.error });
    } catch (e) {
      const { message } = e as Error
      setError({ ...error, message: message });
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className={authStyles.main}>
      <img src='bb_bean.png' alt='Blaue Bohne' className={authStyles.bbImg} />
      <h3 className={authStyles.h1}>- BARREL TRACKER -</h3>
      <AuthForm submit={submit} error={{ error, setError, defaultError }}/>
    </main>
  )
}

export default AuthPage