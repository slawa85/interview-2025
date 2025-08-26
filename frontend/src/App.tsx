import React, { useState, useEffect } from 'react'
import './App.css'
import { VaccinationService } from './services/vaccinationService'
import { VaccinationList } from './components/VaccinationList'
import { VaccinationDetail } from './components/VaccinationDetail'
import { IVaccinationRecord } from './interfaces/IVaccinationRecord'

// Wrapper component for VaccinationDetail to handle async pet data loading
const VaccinationDetailWrapper: React.FC<{ petId: number, onBack: () => void }> = ({ petId, onBack }) => {
  const [petVaccinations, setPetVaccinations] = useState<IVaccinationRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadPetVaccinations = async () => {
      try {
        setLoading(true)
        const vaccinations = await VaccinationService.getVaccinationsForPet(petId)
        setPetVaccinations(vaccinations)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load pet vaccinations')
      } finally {
        setLoading(false)
      }
    }

    loadPetVaccinations()
  }, [petId])

  if (loading) return <div style={{ padding: '2rem' }}>Loading pet vaccinations...</div>
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>Error: {error}</div>

  return (
    <VaccinationDetail
      petId={petId}
      vaccinations={petVaccinations}
      onBack={onBack}
    />
  )
}

function App() {
  const [latestVaccinations, setLatestVaccinations] = useState<IVaccinationRecord[]>([])
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pipelineRunning, setPipelineRunning] = useState(false)
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const vaccinations = await VaccinationService.getLatestVaccinationPerPet()
      const statsData = { totalVaccinations: vaccinations.length, uniquePets: new Set(vaccinations.map(v => v.petId)).size, latestUpdate: null }
      
      setLatestVaccinations(vaccinations)
      setStats(statsData)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const runPipeline = async () => {
    try {
      setPipelineRunning(true)
      setError(null)
      
      console.log('Starting pipeline...')
      const result = await VaccinationService.runPipeline()
      
      console.log('Pipeline completed:', result)

      await loadData()
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Pipeline failed to run')
      console.error('Pipeline error:', err)
    } finally {
      setPipelineRunning(false)
    }
  }

  const handlePetClick = (petId: number) => {
    setSelectedPetId(petId)
  }

  const handleBack = () => {
    setSelectedPetId(null)
  }

  if (loading && latestVaccinations.length === 0) {
    return <div style={{ padding: '2rem' }}>Loading...</div>
  }
  
  if (error && latestVaccinations.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <div style={{ color: 'red', marginBottom: '1rem' }}>Error: {error}</div>
        <button onClick={() => loadData()}>Retry</button>
      </div>
    )
  }

  if (latestVaccinations.length === 0) {
    return (
      <div style={{ padding: '2rem' }}>
        <h1>🐾 Vaccination Data Pipeline</h1>
        <p>No vaccination data found. Run the pipeline to extract and process vaccination records from the raw data.</p>
        
        <div style={{ marginTop: '2rem' }}>
          <button 
            onClick={runPipeline}
            disabled={pipelineRunning}
            style={{
              padding: '1rem 2rem',
              fontSize: '1.1rem',
              backgroundColor: pipelineRunning ? '#ccc' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: pipelineRunning ? 'not-allowed' : 'pointer'
            }}
          >
            {pipelineRunning ? 'Running Pipeline...' : 'Run Pipeline'}
          </button>
        </div>
        
        {pipelineRunning && (
          <div style={{ marginTop: '1rem', color: '#666' }}>
            Processing raw records and extracting vaccination data...
          </div>
        )}

        {error && (
          <div style={{ marginTop: '1rem', color: 'red' }}>
            Error: {error}
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <div style={{ marginBottom: '2rem', padding: '1rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <strong>📊 Status:</strong> {stats?.totalVaccinations || latestVaccinations.length} vaccinations from {stats?.uniquePets || new Set(latestVaccinations.map(v => v.petId)).size} pets
            {stats?.latestUpdate && (
              <span style={{ color: '#666', marginLeft: '1rem' }}>
                Updated: {new Date(stats.latestUpdate).toLocaleDateString()}
              </span>
            )}
          </div>
          <div>
            <button 
              onClick={runPipeline}
              disabled={pipelineRunning}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: pipelineRunning ? '#ccc' : '#28a745',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: pipelineRunning ? 'not-allowed' : 'pointer'
              }}
            >
              {pipelineRunning ? 'Running...' : 'Update Data'}
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{ marginBottom: '1rem', padding: '0.5rem', backgroundColor: '#ffebee', color: '#c62828', borderRadius: '4px' }}>
          {error}
          <button onClick={() => setError(null)} style={{ marginLeft: '1rem', background: 'none', border: 'none', color: '#c62828', cursor: 'pointer' }}>
            ✕
          </button>
        </div>
      )}

      {selectedPetId ? (
        <VaccinationDetailWrapper
          petId={selectedPetId}
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