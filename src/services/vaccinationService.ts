import { supabase } from '../lib/supabase'
import { IRawRecord } from '../interfaces/IRawRecord'
import { IVaccinationRecord } from '../interfaces/IVaccinationRecord'

export class VaccinationService {
  static async getAllRawRecords(): Promise<IRawRecord[]> {
    const { data, error } = await supabase.from('raw_records').select('*')
    if (error) throw error
    return data || []
  }

  static extractVaccinationRecords(rawRecords: IRawRecord[]): IVaccinationRecord[] {
    return rawRecords
      .filter(record => {
        const report = record.raw_record?.report?.toLowerCase() || ''
        return report.includes('vakcinace') || report.includes('vaccination') || report.includes('očkování')
      })
      .map(record => ({
        pet_id: record.pet_id,
        visit_date: record.visit_date,
        visit_id: record.visit_id,
        vaccination_type: this.extractVaccinationType(record.raw_record?.report || '')
      }))
  }

  private static extractVaccinationType(report: string): string {
    const reportLower = report.toLowerCase()
    if (reportLower.includes('vzteklina')) return 'Rabies'
    if (reportLower.includes('vakcinace')) return 'Standard vaccination'
    if (reportLower.includes('očkování')) return 'Vaccination'
    return 'Unknown'
  }

  static getLatestVaccinationPerPet(vaccinations: IVaccinationRecord[]): IVaccinationRecord[] {
    const petMap = new Map<number, IVaccinationRecord>()
    
    vaccinations.forEach(vaccination => {
      const existing = petMap.get(vaccination.pet_id)
      if (!existing || new Date(vaccination.visit_date) > new Date(existing.visit_date)) {
        petMap.set(vaccination.pet_id, vaccination)
      }
    })
    
    return Array.from(petMap.values())
  }

  static getVaccinationsForPet(vaccinations: IVaccinationRecord[], petId: number): IVaccinationRecord[] {
    return vaccinations
      .filter(v => v.pet_id === petId)
      .sort((a, b) => new Date(b.visit_date).getTime() - new Date(a.visit_date).getTime())
  }
}