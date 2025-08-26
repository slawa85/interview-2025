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
      <button 
        onClick={onBack} 
        style={{ 
          marginBottom: '2rem', 
          padding: '0.75rem 1.5rem',
          backgroundColor: '#6c757d',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          fontSize: '1rem',
          transition: 'background-color 0.2s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#5a6268'}
        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#6c757d'}
      >
        ← Back to List
      </button>
      
      <h1>🐾 Pet ID: {petId} - All Vaccinations</h1>
      <p style={{ color: '#666', marginBottom: '2rem' }}>
        Complete vaccination history sorted by date (most recent first)
      </p>
      
      <div style={{ display: 'grid', gap: '1.5rem', maxWidth: '900px' }}>
        {vaccinations.map((vaccination, index) => (
          <div 
            key={`${vaccination.visitId}-${index}`}
            style={{
              border: index === 0 ? '2px solid #4CAF50' : '1px solid #ddd',
              padding: '1.5rem',
              borderRadius: '8px',
              backgroundColor: index === 0 ? '#f8fff8' : '#f9f9f9',
              position: 'relative',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            {index === 0 && (
              <div style={{
                position: 'absolute',
                top: '-10px',
                right: '10px',
                backgroundColor: '#4CAF50',
                color: 'white',
                padding: '0.3rem 0.8rem',
                borderRadius: '12px',
                fontSize: '0.8rem',
                fontWeight: 'bold'
              }}>
                LATEST
              </div>
            )}
            
            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ margin: 0, color: '#333' }}>
                  Visit #{vaccination.visitId}
                </h3>
                <span style={{ 
                  color: '#666', 
                  fontSize: '0.9rem',
                  backgroundColor: '#e9ecef',
                  padding: '0.3rem 0.6rem',
                  borderRadius: '4px'
                }}>
                  {index === 0 ? 'Most Recent' : `${index + 1} of ${vaccinations.length}`}
                </span>
              </div>
              
              <div style={{ display: 'grid', gap: '0.8rem' }}>
                <p style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                  <strong style={{ minWidth: '120px' }}>Date:</strong>
                  <span style={{ 
                    color: '#2196F3',
                    fontSize: '1.1rem',
                    fontWeight: '500'
                  }}>
                    {new Date(vaccination.visitDate).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </p>
                
                <p style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                  <strong style={{ minWidth: '120px' }}>💉 Type:</strong>
                  <span style={{ 
                    backgroundColor: vaccination.vaccinationType?.includes('Rabies') ? '#ffebee' : '#e3f2fd',
                    color: vaccination.vaccinationType?.includes('Rabies') ? '#c62828' : '#1976d2',
                    padding: '0.4rem 0.8rem',
                    borderRadius: '6px',
                    fontSize: '0.95rem',
                    fontWeight: '500'
                  }}>
                    {vaccination.vaccinationType || 'Unknown Type'}
                  </span>
                </p>
                
                <p style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                  <strong style={{ minWidth: '120px' }}>Visit ID:</strong>
                  <code style={{ 
                    backgroundColor: '#f8f9fa',
                    padding: '0.3rem 0.6rem',
                    borderRadius: '4px',
                    fontSize: '0.9rem'
                  }}>
                    {vaccination.visitId}
                  </code>
                </p>

                {vaccination.createdAt && (
                  <p style={{ margin: 0, display: 'flex', alignItems: 'center' }}>
                    <strong style={{ minWidth: '120px' }}>Recorded:</strong>
                    <span style={{ color: '#666', fontSize: '0.9rem' }}>
                      {new Date(vaccination.createdAt).toLocaleDateString()}
                    </span>
                  </p>
                )}
              </div>
            </div>
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
            <h3>No Vaccinations Found</h3>
            <p>No vaccination records found for Pet ID {petId}.</p>
            <p style={{ fontSize: '0.9rem', color: '#999' }}>
              This pet may not have any vaccination records in the system.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}