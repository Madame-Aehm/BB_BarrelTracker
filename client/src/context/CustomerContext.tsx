import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { Customer } from "../@types/customer";
import authHeaders from "../utils/authHeaders";
import { NotOK } from "../@types/auth";
import { AuthContext } from "./AuthContext";
import serverBaseURL from "../utils/baseURL";

interface CustomerContextType {
  customers: Customer[]
}

const defaultValue: CustomerContextType = {
  customers: []
}

export const CustomerContext = createContext(defaultValue);

export const CustomerContextProvider = ({ children }: PropsWithChildren) => {
  const { auth } = useContext(AuthContext);
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    const getCustomers = async() => {
      const headers = authHeaders();
      if (!headers) return
      try {
        const response = await fetch(`${serverBaseURL}/api/customer/active`, { headers });
        if (response.ok) {
          const result = await response.json() as Customer[];
          setCustomers(result);
        } else {
          const result = await response.json() as NotOK;
          console.log(result);
        }
      } catch (e) {
        console.log(e);
      }
    } 
    if (auth) {
      getCustomers().catch((e) => console.log(e))
    }
  }, [auth])

  return <CustomerContext.Provider value={{ customers }}>{ children }</CustomerContext.Provider>
}