import React from 'react'
import { IVaccinationRecord } from '../interfaces/IVaccinationRecord'

interface VaccinationListProps {
  vaccinations: IVaccinationRecord[]
  onPetClick: (petId: number) => void
}

export const VaccinationList: React.FC<VaccinationListProps> = ({ vaccinations, onPetClick }) => {
  return (
    <div>
      <h1>Animals - Latest Vaccinations</h1>
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '600px' }}>
        {vaccinations.map(vaccination => (
          <div 
            key={vaccination.pet_id}
            style={{
              border: '1px solid #ccc',
              padding: '1rem',
              borderRadius: '4px',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9'
            }}
            onClick={() => onPetClick(vaccination.pet_id)}
          >
            <h3>Pet ID: {vaccination.pet_id}</h3>
            <p><strong>Latest Vaccination:</strong> {new Date(vaccination.visit_date).toLocaleDateString()}</p>
            <p><strong>Type:</strong> {vaccination.vaccination_type}</p>
            <p style={{ color: '#666', fontSize: '0.9em' }}>Click to view all vaccinations</p>
          </div>
        ))}
      </div>
    </div>
  )
}