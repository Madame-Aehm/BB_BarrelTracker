export interface Barrel {
  number: number
  _id: string
  home: boolean
  current: null | {
    customer: string
    invoice: string
    createdAt: string
    damage_review?: {
      date: string
      checked: boolean
      comments?: string
    }
  },
}