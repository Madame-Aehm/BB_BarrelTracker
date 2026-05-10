import { authStyles, layoutStyles } from '../styles/styles';
import { useContext, useState } from 'react';
import { PinError } from '../@types/auth';
import AuthForm from '../components/auth/AuthForm';
import { AuthContext } from '../context/AuthContext';

const AuthPage = () => {
  const { loginWithPin, loading, setLoading } = useContext(AuthContext);
  const defaultError = { 1: false, 2: false, 3: false, 4: false, message: "" };
  const [error, setError] = useState<PinError>(defaultError);

  const submit = async(pin: string) => {
    setLoading(true);
    try {
      await loginWithPin(pin);
    } catch (e) {
      const { message } = e as Error;
      setError({ 1: true, 2: true, 3: true, 4: true, message: message });
    } finally {
      setLoading(false);
    }
  }

  return (
      <main className={`${layoutStyles.main} ${layoutStyles.trueCenter}`}>
        <img src='/bb_bean.png' alt='Blaue Bohne' className={authStyles.bbImg} />
        <h1 className={authStyles.h1}>- BARREL TRACKER -</h1>
        <AuthForm submit={submit} loading={loading} error={{ error, setError, defaultError }} />
      </main>
  )
}

export default AuthPage