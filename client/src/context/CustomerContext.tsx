import { PropsWithChildren, createContext, useEffect, useState } from "react";
import { Customer } from "../@types/customer";
import authHeaders from "../utils/authHeaders";
import { NotOK } from "../@types/auth";

interface CustomerContextType {
  customers: Customer[]
}

const defaultValue: CustomerContextType = {
  customers: []
}

export const CustomerContext = createContext(defaultValue);

export const CustomerContextProvider = ({ children }: PropsWithChildren) => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const token = localStorage.getItem("token");
  

  useEffect(() => {
    const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;

    const getCustomers = async() => {
      const headers = authHeaders();
      if (!headers) return
      try {
        // const cache = await caches.open("bb-customers");
        // const request = new Request(`${serverBaseURL}/api/customer/all`, { headers })
        // const cachedCustomers = await cache.match(request);
        // console.log(cachedCustomers)

        const response = await fetch(`${serverBaseURL}/api/customer/all`, { headers });
        if (response.ok) {
          const result = await response.json() as Customer[];
          setCustomers(result);
          
          // const requestClone = {...request}
          // await cache.put(requestClone, response);
          
        } else {
          const result = await response.json() as NotOK;
          console.log(result);
        }
      } catch (e) {
        console.log(e);
      }
    } 

    if (token) getCustomers().catch((e) => console.log(e))
    
  }, [token])

  return <CustomerContext.Provider value={{ customers }}>{ children }</CustomerContext.Provider>
}