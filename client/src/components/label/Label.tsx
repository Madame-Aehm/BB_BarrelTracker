/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect } from 'react'
import * as qr from "@bitjson/qr-code";
import { labelStyles } from '../../styles/styles';

type Props = {
  contents: string
  number: string
}

const Label = ({ contents, number }: Props) => {
  useEffect(() => {qr.defineCustomElements(window)}, [])
  return (
    <div className={labelStyles.labelContainer}>
      {/* 
      // @ts-ignore */}
      <qr-code 
        className={labelStyles.qrcode}
        contents={contents}
        position-ring-color="#0083D0"
        mask-x-to-y-ratio="0.9"  >
          <img 
            className={labelStyles.qrIcon}
            src="bb_cropped.png" 
            slot="icon" 
            alt="QR code is broken.." />
      </qr-code>
      <h1 className={labelStyles.barrelNumber}>#{ number }</h1>
    </div>
  )
}

export default Label