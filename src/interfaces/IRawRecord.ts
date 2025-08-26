export interface IRawRecord {
  user_id: number
  visit_id: number
  pet_id: number
  visit_date: string
  raw_record: {
    report: string
    sections: any
    billItems: any[]
  }
}