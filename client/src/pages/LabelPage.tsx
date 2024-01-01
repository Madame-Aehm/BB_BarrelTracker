import { useState } from 'react'
import Label from '../components/label/Label'
import LabelMenu from '../components/label/LabelMenu'
import labelStyles from '../styles/labels.module.css'
import layoutStyles from '../styles/layout.module.css'
import { LabelType } from '../@types/labels'
import NavBar from '../components/nav/NavBar'
import QRCode from 'react-qr-code'
import LabelPlain from '../components/label/LabelPlain'


const LabelPage = () => {
  const [labels, setLabels] = useState<LabelType[]>([]);
  const [error, setError] = useState("");

  return (
    <main className={labelStyles.main}>
      <div className={layoutStyles.labelNavContainer}>
        <NavBar />
      </div>
      <h1 className={labelStyles.h1}>- Label Generator -</h1>
      <p className={labelStyles.p}>
        Here you can generate labels for the Barrels. Generate a single label by entering a Barrel Number, or
        generate labels for every Barrel in the database with a single click. This page works best on a larger 
        viewport.
      </p>
      <small className={labelStyles.error}>{ error }</small>
      <LabelMenu setState={setLabels} setError={setError} />
      <div className={labelStyles.labelsContainer}>
        {/* { labels.map((l) => <Label key={l._id} contents={l._id} number={l.number.toString()} />)} */}
        { labels.map((l) => <LabelPlain key={l._id} id={l._id} number={l.number.toString()} />) }
      </div>
    </main>
  )
}

export default LabelPage