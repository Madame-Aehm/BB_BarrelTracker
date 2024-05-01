import { useState } from 'react'
// import Label from '../components/label/Label'
import LabelMenu from '../components/label/LabelMenu'
import { labelStyles } from '../styles/styles'
import { LabelType } from '../@types/labels'
import LabelPlain from '../components/label/LabelPlain'
import Button from '../components/Button'
import downloadAll from '../utils/QRDownload'
import useFetch from '../hooks/useFetch'
import ToTop from '../components/ToTop'


const LabelPage = () => {
  const [downloading, setDownloading] = useState(false);
  const [url, setUrl] = useState("");
  const { data, loading, error, setError } = useFetch<LabelType[]>(url);
  const labels = data ? data : [];

  return (
    <>
      <h1>- Label Generator -</h1>
      <small className={labelStyles.error}>{ error }</small>
      <LabelMenu loadingControl={loading} setUrl={setUrl} setError={setError} />
      { labels.length > 0 && (
        <Button 
          handleClick={() => downloadAll(labels, setDownloading)} 
          title='Download'
          loading={downloading}
          styleOverride={{ width: "15rem", height: "4rem", marginTop: "1rem" }} />)
      }
      <div id='codes' className={labelStyles.labelsContainer}>
        {/* { labels.map((l) => <Label key={l._id} contents={l._id} number={l.number.toString()} />)} */}
        { labels.map((l) => <LabelPlain key={l._id} id={l._id} number={l.number.toString()} />) }
      </div>
      <ToTop />
    </>
  )
}

export default LabelPage