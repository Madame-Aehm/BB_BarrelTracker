import { PropsWithChildren, useContext } from 'react'
import { AuthContext } from '../../context/AuthContext'
import AuthPage from '../../pages/AuthPage';

const AuthWrapper = ({ children }: PropsWithChildren) => {
  const { auth, firstCheck } = useContext(AuthContext);
  console.log(auth, firstCheck);
  if (!firstCheck) return <div>authenticating...</div>
  return auth ? children : <AuthPage />;
}

export default AuthWrapper