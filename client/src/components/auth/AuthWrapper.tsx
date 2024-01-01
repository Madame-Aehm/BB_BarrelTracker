import { PropsWithChildren, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import AuthPage from '../../pages/AuthPage';

const AuthWrapper = ({ children }: PropsWithChildren) => {
  const { auth, firstCheck } = useContext(AuthContext);
  return firstCheck ? ( auth ? children : <AuthPage /> ) : "authenticating...";
}

export default AuthWrapper