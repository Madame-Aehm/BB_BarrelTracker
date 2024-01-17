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
  opened: string
  closed?: string
  comments?: string
  response?: string
}

export interface BrlHistory extends Open {
  barrel?: number
}

export type SendParamsType = {
  params: string
}