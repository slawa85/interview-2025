import React, { useState, useEffect } from 'react'
import './App.css'
import { VaccinationService } from './services/vaccinationService'
import { VaccinationList } from './components/VaccinationList'
import { VaccinationDetail } from './components/VaccinationDetail'
import { IVaccinationRecord } from './interfaces/IVaccinationRecord'

function App() {
  const [allVaccinations, setAllVaccinations] = useState<IVaccinationRecord[]>([])
  const [latestVaccinations, setLatestVaccinations] = useState<IVaccinationRecord[]>([])
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadVaccinations()
  }, [])

  const loadVaccinations = async () => {
    try {
      setLoading(true)
      const rawRecords = await VaccinationService.getAllRawRecords()
      const vaccinations = VaccinationService.extractVaccinationRecords(rawRecords)
      const latest = VaccinationService.getLatestVaccinationPerPet(vaccinations)
      
      setAllVaccinations(vaccinations)
      setLatestVaccinations(latest)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handlePetClick = (petId: number) => {
    setSelectedPetId(petId)
  }

  const handleBack = () => {
    setSelectedPetId(null)
  }

  if (loading) return <div style={{ padding: '2rem' }}>Loading...</div>
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>

  return (
    <div style={{ padding: '2rem' }}>
      {selectedPetId ? (
        <VaccinationDetail
          petId={selectedPetId}
          vaccinations={VaccinationService.getVaccinationsForPet(allVaccinations, selectedPetId)}
          onBack={handleBack}
        />
      ) : (
        <VaccinationList
          vaccinations={latestVaccinations}
          onPetClick={handlePetClick}
        />
      )}
    </div>
  )
}

export default App
