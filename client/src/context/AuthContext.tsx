/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, PropsWithChildren, createContext, useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import getVersion from "../versionControl";
import serverBaseURL from "../utils/baseURL";

interface AuthContextType {
  auth: boolean
  setAuth: Dispatch<React.SetStateAction<boolean>>
  loading: boolean
  setLoading: Dispatch<React.SetStateAction<boolean>>
  error: string
}

const defaultValue: AuthContextType = {
  auth: false,
  setAuth: () => { throw new Error("No Provider") },
  loading: true,
  setLoading: () => { throw new Error("No Provider") },
  error: ""
}

export const AuthContext = createContext(defaultValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const [auth, setAuth] = useState(false);

  const { data, loading, setLoading, error } = useFetch<true>(`${serverBaseURL}/api/auth/authorized`);

  useEffect(() => {
    if (error) {
      localStorage.removeItem("token");
      setAuth(false);
    }
    if (data === true) setAuth(data);
  }, [data, error])

  useEffect(() => {
    getVersion().catch(e => console.log(e));
  }, [])

  return <AuthContext.Provider value={{ auth, setAuth, loading, setLoading, error }}>
    { children }
  </AuthContext.Provider>
}