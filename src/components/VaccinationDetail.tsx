import React from 'react'
import { IVaccinationRecord } from '../interfaces/IVaccinationRecord'

interface VaccinationDetailProps {
  petId: number
  vaccinations: IVaccinationRecord[]
  onBack: () => void
}

export const VaccinationDetail: React.FC<VaccinationDetailProps> = ({ petId, vaccinations, onBack }) => {
  return (
    <div>
      <button onClick={onBack} style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
        ← Back to List
      </button>
      <h1>Pet ID: {petId} - All Vaccinations</h1>
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        {vaccinations.map((vaccination, index) => (
          <div 
            key={`${vaccination.visit_id}-${index}`}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '4px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <h3>Visit #{vaccination.visit_id}</h3>
            <p><strong>Date:</strong> {new Date(vaccination.visit_date).toLocaleDateString()}</p>
            <p><strong>Type:</strong> {vaccination.vaccination_type}</p>
          </div>
        ))}
        {vaccinations.length === 0 && (
          <p>No vaccinations found for this pet.</p>
        )}
      </div>
    </div>
  )
}