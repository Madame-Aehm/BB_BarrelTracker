/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, PropsWithChildren, createContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";

interface AuthContextType {
  auth: boolean
  setAuth: Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  error: string
}

const defaultValue: AuthContextType = {
  auth: false,
  setAuth: () => { throw new Error("No Provider") },
  loading: true,
  error: ""
}

export const AuthContext = createContext(defaultValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const [auth, setAuth] = useState(false);

  const { data, loading, error } = useFetch<true>(`${serverBaseURL}/api/auth/authorized`);

  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
    }
    if (data === true) setAuth(data);
  }, [data, error])

  return <AuthContext.Provider value={{ auth, setAuth, loading, error }}>
    { children }
  </AuthContext.Provider>
}