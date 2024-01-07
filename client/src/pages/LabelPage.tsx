import { useState } from 'react'
// import Label from '../components/label/Label'
import LabelMenu from '../components/label/LabelMenu'
import labelStyles from '../styles/labels.module.css'
import layoutStyles from '../styles/layout.module.css'
import { LabelType } from '../@types/labels'
import NavBar from '../components/nav/NavBar'
import LabelPlain from '../components/label/LabelPlain'
import Button from '../components/Button'


const LabelPage = () => {
  const [labels, setLabels] = useState<LabelType[]>([]);
  const [error, setError] = useState("");
  const [downloading, setDownloading] = useState(false);

  const downloadFunction = (i: number) => {
    const svg = document.getElementById(labels[i]._id);
    if (!svg) return console.log("no svg");
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return console.log("no ctx");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL("image/png");
      const downloadLink = document.createElement("a");
      downloadLink.id = `link_${labels[i]._id}`
      downloadLink.download = `Barrel_${labels[i].number}`;
      downloadLink.href = `${pngFile}`;
      downloadLink.click();
    };
    img.src = `data:image/svg+xml;base64,${btoa(svgData)}`;
  }

  const downloadAll = () => {
    setDownloading(true);
    labels.forEach((_, i) => {
      setTimeout(() => {
        downloadFunction(i);
      }, 200 * i)
    })
    setTimeout(() => {
      setDownloading(false);
    }, labels.length * 200);
  };

  return (
    <main className={layoutStyles.main}>
      <div className={layoutStyles.labelNavContainer}>
        <NavBar />
      </div>
      <h1>- Label Generator -</h1>
      <small className={labelStyles.error}>{ error }</small>
      <LabelMenu setState={setLabels} setError={setError} />
      { labels.length > 0 && (
        <Button 
          handleClick={downloadAll} 
          title='Download'
          loading={downloading}
          styleOverride={{ width: "15rem", height: "4rem", marginTop: "1rem" }} />)
      }
      <div id='codes' className={labelStyles.labelsContainer}>
        {/* { labels.map((l) => <Label key={l._id} contents={l._id} number={l.number.toString()} />)} */}
        { labels.map((l) => <LabelPlain key={l._id} id={l._id} number={l.number.toString()} />) }
      </div>
      
    </main>
  )
}

export default LabelPage