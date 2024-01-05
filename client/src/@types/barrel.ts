export interface Barrel {
  number: number
  _id: string
  damaged: boolean
  open: null | Open,
}

export interface Open {
  _id: string
  customer: string
  invoice: string
  createdAt: string
  damage_review?: Damage_Review
}

export interface Damage_Review {
  opened: string
  closed?: string
  comments?: string
  
}