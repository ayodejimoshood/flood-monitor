'use client';

import { useState } from 'react';
import StationSelector from './components/StationSelector';
import MeasureSelector from './components/MeasureSelector';
import ReadingsChart from './components/ReadingsChart';
import ReadingsTable from './components/ReadingsTable';
import { Station, Measure } from './types';

export default function Home() {
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [selectedMeasure, setSelectedMeasure] = useState<Measure | null>(null);

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setSelectedMeasure(null); // Reset selected measure when station changes
  };

  const handleMeasureSelect = (measure: Measure) => {
    setSelectedMeasure(measure);
  };

  return (
    <div>
      <section>
        <div className="card" style={{ 
          textAlign: 'center', 
          marginBottom: '2rem',
          background: 'linear-gradient(135deg, var(--primary-color) 0%, var(--primary-dark) 100%)',
          color: 'white',
          boxShadow: 'var(--shadow-lg)'
        }}>
          <h2 style={{ color: 'white', marginBottom: '0.5rem' }}>UK Flood Monitoring Dashboard</h2>
          <p style={{ opacity: 0.9, maxWidth: '800px', margin: '0 auto' }}>
            Monitor real-time flood data from the UK Environmental Agency's measurement stations across the country.
            View water levels and flow data as interactive charts and tables.
          </p>
        </div>
        
        <div className="grid" style={{ gap: '1.5rem' }}>
          <div style={{ gridColumn: '1 / -1' }}>
            <StationSelector onStationSelect={handleStationSelect} />
          </div>
          
          {selectedStation && (
            <div style={{ gridColumn: '1 / -1' }}>
              <MeasureSelector 
                station={selectedStation} 
                onMeasureSelect={handleMeasureSelect} 
              />
            </div>
          )}
        </div>
        
        {selectedMeasure && (
          <div className="grid grid-2" style={{ marginTop: '1.5rem' }}>
            <div style={{ gridColumn: '1 / -1' }}>
              <ReadingsChart measure={selectedMeasure} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <ReadingsTable measure={selectedMeasure} />
            </div>
          </div>
        )}
        
        {!selectedStation && (
          <div className="card" style={{ 
            marginTop: '2rem', 
            textAlign: 'center',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            border: '1px dashed var(--border-color)'
          }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ 
                margin: '0 auto 1rem',
                color: 'var(--primary-color)',
                opacity: 0.7
              }}
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            <h3>Select a Station to Begin</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Choose a measurement station from the dropdown above to view available measures and readings data.
              You can search for stations by name, river, or town.
            </p>
          </div>
        )}
        
        {selectedStation && !selectedMeasure && (
          <div className="card" style={{ 
            marginTop: '2rem', 
            textAlign: 'center',
            backgroundColor: 'rgba(59, 130, 246, 0.05)',
            border: '1px dashed var(--border-color)'
          }}>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="48" 
              height="48" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{ 
                margin: '0 auto 1rem',
                color: 'var(--primary-color)',
                opacity: 0.7
              }}
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
            </svg>
            <h3>Select a Measure to View Data</h3>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
              Now select a measure from the dropdown above to view the readings data.
              The chart and table will display data from the last 24 hours.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
