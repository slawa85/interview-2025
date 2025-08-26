export interface IVaccinationRecord {
  id?: number
  petId: number
  visitId: number
  visitDate: string
  vaccinationType?: string
  createdAt?: string
  updatedAt?: string
}