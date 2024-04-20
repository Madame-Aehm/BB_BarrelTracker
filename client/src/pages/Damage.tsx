import { useLocation, useNavigate } from "react-router-dom"
import barrelStyles from '../styles/barrel.module.css'
import { Barrel, ImgObject } from "../@types/barrel";
import CancelButton from "../components/barrel/CancelButton";
import { ChangeEvent, useRef, useState } from "react";
import Loading from "../components/Loading";
import Button from "../components/Button";
import { OK } from "../@types/auth";
import { compressImage } from "../utils/images";
import serverBaseURL from "../utils/baseURL";
import ImageController from "../components/barrel/ImageController";
import usePost from "../hooks/usePost";

interface locationState {
  state: { barrel: Barrel } | null
}

function Damage() {
  const navigate = useNavigate();
  const { state } = useLocation() as locationState;
  const [successMessage, setSuccessMessage] = useState("");
  const comments = useRef("");
  const files = useRef<File[]>([]);

  const [images, setImages] = useState<ImgObject[]>([])

  const generateBody = () => {
    const body = new FormData();
    body.append("id", state?.barrel._id || "");
    if (comments.current) body.append("comments", comments.current);
    files.current.forEach((file) => body.append("images", file));
    return body
  }

  const { error, loading, makePostRequest } = usePost<OK>({
    url: `${serverBaseURL}/api/barrel/request-damage-review`,
    successCallback: (res) => {
      setSuccessMessage(res.message);
    }
  })

  const submitRequest = async() => {
    console.log(comments.current)
    if (!state) return
    await makePostRequest(generateBody());
  }

  const fileChange = async(e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const toCompress = [...e.target.files].map((file) => compressImage(file));
      const compressed = (await Promise.all(toCompress)).map(file => file)
      files.current = [...files.current, ...compressed];
      setImages(prev => {
        const getUrls = [];
        for (let i = 0; i < e.target.files!.length; i++) {
          getUrls.push({ url: URL.createObjectURL(e.target.files![i])} );
        }
        return [...prev, ...getUrls ]
      })
    }
  } 

  const removeFile = (img: ImgObject) => {
    const index = images.findIndex(e => e.url === img.url);
    if (index >= 0) {
      setImages(prev => prev.filter((_, i) => i !== index));
      files.current = files.current && [...files.current].filter((_, i) => i !== index);
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
        <ImageController imageArray={images} fileAdd={fileChange} id="imageUpload" imageRemove={removeFile} />
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