import { useState } from 'react'
// import Label from '../components/label/Label'
import LabelMenu from '../components/label/LabelMenu'
import labelStyles from '../styles/labels.module.css'
import layoutStyles from '../styles/layout.module.css'
import { LabelType } from '../@types/labels'
import NavBar from '../components/nav/NavBar'
import LabelPlain from '../components/label/LabelPlain'


const LabelPage = () => {
  const [labels, setLabels] = useState<LabelType[]>([]);
  const [error, setError] = useState("");

  return (
    <main className={layoutStyles.main}>
      <div className={layoutStyles.labelNavContainer}>
        <NavBar />
      </div>
      <h1>- Label Generator -</h1>
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