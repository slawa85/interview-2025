import { IVaccinationRecord } from '../interfaces/IVaccinationRecord'

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001'

export interface VaccinationStats {
  totalVaccinations: number
  uniquePets: number
  latestUpdate: string | null
}

export class VaccinationService {
  static async getLatestVaccinationPerPet(): Promise<IVaccinationRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccinations`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching latest vaccinations:', error)
      throw new Error('Failed to load latest vaccinations. Make sure the backend server is running.')
    }
  }

  static async getVaccinationsForPet(petId: number): Promise<IVaccinationRecord[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccinations/pet/${petId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error(`Error fetching vaccinations for pet ${petId}:`, error)
      throw new Error('Failed to load pet vaccinations. Make sure the backend server is running.')
    }
  }

  static async getVaccinationStats(): Promise<VaccinationStats> {
    try {
      const response = await fetch(`${API_BASE_URL}/vaccinations/stats`)
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error fetching vaccination statistics:', error)
      throw new Error('Failed to load vaccination statistics.')
    }
  }

  static async runPipeline(): Promise<{
    success: boolean
    message: string
    results: {
      processed: number
      extracted: number
      saved: number
      errors: number
    }
  }> {
    try {
      const response = await fetch(`${API_BASE_URL}/pipeline/run`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
      
      return await response.json()
    } catch (error) {
      console.error('Error running pipeline:', error)
      throw new Error('Failed to run pipeline. Make sure the backend server is running.')
    }
  }
}