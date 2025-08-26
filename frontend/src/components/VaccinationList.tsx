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
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Showing {vaccinations.length} pets with their most recent vaccination records
      </p>
      
      <div style={{ display: 'grid', gap: '1rem', maxWidth: '800px' }}>
        {vaccinations.map(vaccination => (
          <div 
            key={`pet-${vaccination.petId}`}
            style={{
              border: '1px solid #ddd',
              padding: '1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              backgroundColor: '#f9f9f9',
              transition: 'all 0.2s ease',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onClick={() => onPetClick(vaccination.petId)}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0f0f0'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f9f9f9'
              e.currentTarget.style.transform = 'translateY(0px)'
              e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            <h3 style={{ margin: '0 0 1rem 0', color: '#333' }}>
              Pet ID: {vaccination.petId}
            </h3>
            
            <div style={{ display: 'grid', gap: '0.5rem' }}>
              <p style={{ margin: 0 }}>
                <strong>Latest Vaccination:</strong>{' '}
                <span style={{ color: '#2196F3' }}>
                  {new Date(vaccination.visitDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </p>
              
              <p style={{ margin: 0 }}>
                <strong>Type:</strong>{' '}
                <span style={{ 
                  backgroundColor: '#e3f2fd', 
                  padding: '0.2rem 0.5rem', 
                  borderRadius: '4px',
                  fontSize: '0.9em'
                }}>
                  {vaccination.vaccinationType || 'Unknown'}
                </span>
              </p>
              
              <p style={{ margin: 0 }}>
                <strong>Visit ID:</strong> {vaccination.visitId}
              </p>
            </div>
            
            <p style={{ 
              color: '#666', 
              fontSize: '0.9em', 
              marginTop: '1rem', 
              marginBottom: 0,
              fontStyle: 'italic'
            }}>
              Click to view all vaccinations for this pet
            </p>
          </div>
        ))}
        
        {vaccinations.length === 0 && (
          <div style={{
            padding: '3rem',
            textAlign: 'center',
            color: '#666',
            backgroundColor: '#f5f5f5',
            borderRadius: '8px',
            border: '2px dashed #ccc'
          }}>
            <h3>No Vaccination Data</h3>
            <p>No vaccination records found. Please run the pipeline to extract data.</p>
          </div>
        )}
      </div>
    </div>
  )
}