export type ToUpdateEditBarrel = {
  number: number | ""
  damaged: boolean
  open: Open | null
}

export interface Barrel extends ToUpdateEditBarrel {
  number: number
  _id: string
  history?: Open[]
}

export interface Open {
  _id: string
  customer: string
  invoice: string
  createdAt: string
  returned?: string
  damage_review?: Damage_Review
}

export interface Damage_Review {
  createdAt: string
  closed?: string
  comments?: string
  response?: string
  images: ImgObject[]
}


export interface ImgObject {
  public_id?: string
  url: string
  _id?: string
}

export type SendParamsType = {
  params: string
}