import { Navigate, Outlet, useLocation, useParams } from "react-router-dom"


const BarrelPage = () => {
  const location = useLocation();
  const params = useParams();
  const paramsToAdd = params.brl ? `${location.state === "scanner" ? `id=${params.brl}` : `number=${params.brl}`}` : "";
  if (location.pathname === "/barrel") return <Navigate to={"/"} />
  return (
    <Outlet context={{ params: paramsToAdd }} />
  )
}

export default BarrelPage