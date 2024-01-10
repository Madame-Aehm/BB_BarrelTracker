import { PropsWithChildren, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import AuthPage from '../../pages/AuthPage';
import Loading from '../Loading';

const AuthWrapper = ({ children }: PropsWithChildren) => {
  const { auth, loading } = useContext(AuthContext);
  if (loading) return <Loading />
  return auth ? children : <AuthPage />;
}

export default AuthWrapper