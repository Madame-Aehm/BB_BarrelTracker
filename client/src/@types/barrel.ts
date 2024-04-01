export interface Barrel {
  number: number
  _id: string
  damaged: boolean
  open: null | Open,
  history?: BrlHistory[]
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

export interface BrlHistory extends Open {
  barrel?: number
}

export type SendParamsType = {
  params: string
}