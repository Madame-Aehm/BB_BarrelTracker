/* eslint-disable @typescript-eslint/no-misused-promises */
import { ChangeEvent, FormEvent } from 'react'
import { labelStyles } from '../styles/styles'
import PinInput from './auth/PinInput'
import Button from './Button'

type Props = {
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void> | void
  invalid: boolean
  loading?: string
}

const BrlNumForm = ({ loading, handleChange, handleSubmit, invalid }:Props) => {

  return (
    <form onSubmit={handleSubmit} >
      <div className={labelStyles.genBarrelLabelPair}>
        <label><h3>Barrel Number:</h3></label>
        <PinInput handleChange={handleChange} invalid={invalid} styleOverride={{ width: "3rem" }}/>
      </div>
      <Button 
        loading={loading === "single" ? true : false} 
        title='Go!'
        styleOverride={{ width: "12rem", height: "3.5rem" }} />
    </form>
  )
}

export default BrlNumForm