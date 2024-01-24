import { useLocation, useNavigate } from "react-router-dom"
import barrelStyles from '../styles/barrel.module.css'
import { Barrel } from "../@types/barrel";
import CancelButton from "../components/barrel/CancelButton";
import { ChangeEvent, useRef, useState } from "react";
import Loading from "../components/Loading";
import Button from "../components/Button";
import authHeaders from "../utils/authHeaders";
import { handleCatchError, handleNotOK } from "../utils/handleFetchFail";
import { OK } from "../@types/auth";

interface locationState {
  state: { barrel: Barrel } | null
}
function Damage() {
  const serverBaseURL = import.meta.env.VITE_SERVER_BASEURL as string;
  const navigate = useNavigate();
  const { state } = useLocation() as locationState;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const comments = useRef("");
  const files = useRef<FileList | null>(null);

  const submitRequest = async() => {
    if (!state) return
    setLoading(true);
    const body = new FormData();
    body.append("id", state.barrel._id);
    if (comments.current) body.append("comments", comments.current);
    if (files.current) {
      Array.from(files.current).forEach((file) => {
        body.append("images", file);
      })
    }
    const headers = authHeaders();
    if (!headers) return
    try {
      const response = await fetch(`${serverBaseURL}/api/barrel/request-damage-review`, { headers, body, method: "POST" });
      if (response.ok) {
        const result = await response.json() as OK;
        setTimeout(() => {
          setLoading(false);
          setSuccessMessage(result.message);
        }, 1000)
      } else {
        await handleNotOK(response, setError, setLoading);
      }
    } catch (e) {
      handleCatchError(e, setError, setLoading);
    }
  }

  const fileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      files.current = e.target.files;
    }
  } 

  const handleTextChange = (e: ChangeEvent<HTMLTextAreaElement>) => {
    comments.current = e.target.value;
  }

  if (loading) return <Loading />
  if (!state || error || successMessage) return (
    <>
      { successMessage && (
        <div>
          <p className={barrelStyles.sideMargins}>{ successMessage }</p>
          <Button 
            loading={false}
            title="OK"
            styleOverride={{ width: "10rem", height: "4rem", marginTop: "1rem" }} 
            handleClick={() => navigate("/", { replace: true })} />
        </div> 
      )}
      { error && <p>{ error }</p> } 
      { !state && <p>How did you get here...? 🧐</p> } 
    </>
  ) 
  if (state.barrel) return (
    <>
      <h1>Request Damage Review</h1>
      <div className={`${barrelStyles.atHome} ${barrelStyles.gap1} ${barrelStyles.width80}`}>
        <textarea 
          onChange={handleTextChange}
          className={`${barrelStyles.input} ${barrelStyles.textarea}`}
          placeholder="If you have any notes to provide, please add them here (optional)"/>
        <input 
          type="file" 
          accept="image/png, image/jpeg, image/jpg" 
          onChange={fileChange}
          multiple />
        <div className={barrelStyles.centerButton}>
          <CancelButton  />
          <Button
            loading={loading}
            title="Submit"
            styleOverride={{ width: "10rem", height: "4rem" }} 
            handleClick={submitRequest}
          />
        </div>
      </div>
    </>
  )
}

export default Damage