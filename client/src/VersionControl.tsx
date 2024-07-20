import { PropsWithChildren, useState } from "react"
import useFetch from "./hooks/useFetch";
import serverBaseURL from "./utils/baseURL";
import Button from "./components/Button";

type VersionRes = { version: string }


function VersionControl({ children }: PropsWithChildren) {
  const { data } = useFetch<VersionRes>(`${serverBaseURL}/api/version`);
  const [version, setVersion] = useState(localStorage.getItem("version"))

  const handleClick = () => {
    if (data) { 
      localStorage.setItem("version", data.version);
      setVersion(data.version);
    }
  }

  if (data && data.version !== version) { 
    return (
      <div style={{ marginTop: "20vh", textAlign: "center" }}>
        <h1 >
          Update available! Please do a hard refresh ASAP 😚 
        </h1>
        <Button handleClick={handleClick} title="I did it!" styleOverride={{ width: "12rem", height: "3.5rem" }}/>
      </div>
    )
  }
  return children
}

export default VersionControl