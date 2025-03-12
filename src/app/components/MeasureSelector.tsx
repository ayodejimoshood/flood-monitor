import { useState, useEffect } from 'react';
import { Measure, Station } from '../types';
import { getStationMeasures } from '../api';
import SelectInput from './SelectInput';

interface MeasureSelectorProps {
  station: Station;
  onMeasureSelect: (measure: Measure) => void;
}

export default function MeasureSelector({ station, onMeasureSelect }: MeasureSelectorProps) {
  const [measures, setMeasures] = useState<Measure[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMeasure, setSelectedMeasure] = useState<Measure | null>(null);

  useEffect(() => {
    const fetchMeasures = async () => {
      try {
        setLoading(true);
        setSelectedMeasure(null);
        const measuresData = await getStationMeasures(station.stationReference);
        setMeasures(measuresData);
        setLoading(false);
      } catch (error) {
        setError('Failed to load measures for this station. Please try again later.');
        console.error('Error fetching measures:', error);
        setLoading(false);
      }
    };

    fetchMeasures();
  }, [station]);

  const handleMeasureSelect = (measureId: string) => {
    const measure = measures.find(m => m['@id'] === measureId);
    if (measure) {
      setSelectedMeasure(measure);
      onMeasureSelect(measure);
    }
  };

  if (loading) {
    return <div className="loading">Loading measures...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (measures.length === 0) {
    return (
      <div className="card">
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          color: 'var(--warning-color)',
          backgroundColor: 'rgba(245, 158, 11, 0.1)',
          padding: '1rem',
          borderRadius: 'var(--radius-sm)',
          borderLeft: '3px solid var(--warning-color)'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          No measures available for this station.
        </div>
      </div>
    );
  }

  // Group measures by parameter type for better organization
  const groupedMeasures: Record<string, Measure[]> = {};
  measures.forEach(measure => {
    if (!groupedMeasures[measure.parameterName]) {
      groupedMeasures[measure.parameterName] = [];
    }
    groupedMeasures[measure.parameterName].push(measure);
  });

  // Format measures for the SelectInput component
  const measureOptions = measures.map(measure => ({
    value: measure['@id'],
    label: `${measure.qualifier ? measure.qualifier : measure.parameterName}${measure.unitName ? ` (${measure.unitName})` : ''}`,
    group: measure.parameterName
  }));

  return (
    <div>
      <h2 style={{ 
        fontSize: '1.3rem', 
        // marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
      }}>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
          <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
        </svg>
        Select a Measure
      </h2>
      
      <SelectInput
        label="Available measures:"
        options={measureOptions}
        value={selectedMeasure?.['@id'] || ''}
        onChange={handleMeasureSelect}
        placeholder="-- Select a measure --"
      />
      
      {selectedMeasure && (
        <div className="station-info">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', marginTop: '0.75rem' }}>
            <h3 style={{ margin: 0, color: 'var(--primary-color)' }}>
              {selectedMeasure.parameterName}
            </h3>
            <span className="badge">
              {selectedMeasure.unitName}
            </span>
          </div>
          
          {selectedMeasure.qualifier && (
            <div className="info-row">
              <div className="info-label">Qualifier:</div>
              <div className="info-value">{selectedMeasure.qualifier}</div>
            </div>
          )}
          
          {selectedMeasure.period && (
            <div className="info-row">
              <div className="info-label">Period:</div>
              <div className="info-value">{selectedMeasure.period} seconds</div>
            </div>
          )}
          
          {selectedMeasure.valueType && (
            <div className="info-row">
              <div className="info-label">Value Type:</div>
              <div className="info-value">{selectedMeasure.valueType}</div>
            </div>
          )}
          
          {selectedMeasure.latestReading && (
            <div style={{ 
              marginTop: '1rem', 
              padding: '0.75rem', 
              backgroundColor: 'rgba(16, 185, 129, 0.1)', 
              borderRadius: 'var(--radius-sm)',
              borderLeft: '3px solid var(--secondary-color)'
            }}>
              <div style={{ fontWeight: 500, marginBottom: '0.25rem', color: 'var(--secondary-color)' }}>
                Latest Reading
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                  {selectedMeasure.latestReading.value} {selectedMeasure.unitName}
                </div>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  {new Date(selectedMeasure.latestReading.dateTime).toLocaleString()}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 