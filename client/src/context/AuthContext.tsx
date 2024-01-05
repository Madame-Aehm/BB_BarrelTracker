/* eslint-disable react-hooks/exhaustive-deps */
import { Dispatch, PropsWithChildren, createContext, useEffect, useState } from "react";
import { CurrentAuth, NotOK } from "../@types/auth";
import authHeaders from "../utils/authHeaders";
import { handleCatchError } from "../utils/handleFetchFail";

interface AuthContextType {
  auth: boolean
  setAuth: Dispatch<React.SetStateAction<boolean>>
  firstCheck: boolean
  authError: string
}

const defaultValue: AuthContextType = {
  auth: false,
  setAuth: () => { throw new Error("No Provider") },
  firstCheck: false,
  authError: ""
}

export const AuthContext = createContext(defaultValue);

export const AuthContextProvider = ({ children }: PropsWithChildren) => {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const [auth, setAuth] = useState(false);
  const [firstCheck, setFirstCheck] = useState(false);
  const [authError, setAuthError] = useState("");

  const currentAuthStatus = async() => {
    const headers = authHeaders();
    if (!headers) return
    try {
      const response = await fetch(`${serverBaseURL}/api/auth/authorized`, { headers });
      if (response.ok) {
        const result = await response.json() as CurrentAuth;
        setAuth(result.authorized);
      } else {
        const result = await response.json() as NotOK;
        console.log(result);
        localStorage.removeItem("token");
      }
    } catch(e) {
      handleCatchError(e, setAuthError);
    }
  }

  useEffect(() => {
    currentAuthStatus()
      .then(() => setFirstCheck(true))
      .catch((e) => console.log(e));
  }, []);

  return <AuthContext.Provider value={{ auth, setAuth, authError, firstCheck }}>
    { children }
  </AuthContext.Provider>
}