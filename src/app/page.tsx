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
        <div style={{ 
          textAlign: 'center', 
          marginBottom: '3rem',
          maxWidth: '800px',
          margin: '0 auto 3rem'
        }}>
          <h1 className="gradient-text" style={{ 
            fontSize: '3rem', 
            fontWeight: 800, 
            letterSpacing: '-0.05em',
            marginBottom: '1.5rem'
          }}>
            UK Flood Monitoring
          </h1>
          <p style={{ 
            fontSize: '1.125rem', 
            color: 'var(--text-secondary)',
            maxWidth: '600px',
            margin: '0 auto 1.5rem'
          }}>
            Real-time flood data from the UK Environmental Agency&apos;s measurement stations across the country.
          </p>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '1rem',
            marginBottom: '1rem',
            flexWrap: 'wrap'
          }}>
            <a 
              href="https://github.com/ayodejimoshood/flood-monitor/releases/download/v0.1.0/UK%20Flood%20Monitor-0.1.0-arm64.dmg" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn"
              style={{ height: '2.75rem' }}
            >
              Download for Mac 
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="btn btn-outline"
              style={{ 
                height: '2.75rem',
                opacity: 0.7,
                cursor: 'not-allowed'
              }}
              title="Coming Soon"
            >
              Download for Windows
            </a>
            <a 
              href="#" 
              onClick={(e) => e.preventDefault()}
              className="btn btn-outline"
              style={{ 
                height: '2.75rem',
                opacity: 0.7,
                cursor: 'not-allowed'
              }}
              title="Coming Soon"
            >
              Download for Linux
            </a>
            <a 
              href="https://github.com/ayodejimoshood/flood-monitor" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ height: '2.75rem' }}
            >
              View on GitHub
            </a>
          </div>
          <p style={{ 
            fontSize: '0.875rem', 
            color: 'var(--text-secondary)',
            textAlign: 'center',
            marginBottom: '2rem'
          }}>
            Get the desktop app for a better experience. Windows and Linux versions coming soon.
            <a 
              href="https://environment.data.gov.uk/flood-monitoring/doc/reference" 
              target="_blank" 
              rel="noopener noreferrer"
              style={{ 
                marginLeft: '0.5rem',
                color: 'var(--primary-color)',
                textDecoration: 'none'
              }}
            >
              API Documentation
            </a>
          </p>
        </div>
        
        <div className="dashboard-layout">
          <div className="sidebar">
            <div className="card station-selector-card" style={{ 
              border: '1px solid var(--border-color)',
              // boxShadow: 'var(--shadow)',
              borderRadius: 'var(--radius)',
              overflow: 'hidden',
              height: '100%'
            }}>
              <StationSelector onStationSelect={handleStationSelect} />
            </div>
          </div>
          
          <div className="main-content">
            {selectedStation ? (
              <>
                <div className="card" style={{ 
                  // marginBottom: '2rem',
                  border: '1px solid var(--border-color)',
                  // boxShadow: 'var(--shadow)',
                  borderRadius: 'var(--radius)',
                  overflow: 'hidden',
                }}>
                  <MeasureSelector 
                    station={selectedStation} 
                    onMeasureSelect={handleMeasureSelect} 
                  />
                </div>
                
                {selectedMeasure ? (
                  <>
                    <div className="card" style={{ 
                      // marginBottom: '2rem',
                      border: '1px solid var(--border-color)',
                      // boxShadow: 'var(--shadow)',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                    }}>
                      <ReadingsChart measure={selectedMeasure} />
                    </div>
                    <div className="card" style={{ 
                      // marginBottom: '2rem',
                      border: '1px solid var(--border-color)',
                      // boxShadow: 'var(--shadow)',
                      borderRadius: 'var(--radius)',
                      overflow: 'hidden',
                    }}>
                      <ReadingsTable measure={selectedMeasure} />
                    </div>
                  </>
                ) : (
                  <div style={{ 
                    textAlign: 'center',
                    padding: '3rem 1.5rem',
                    backgroundColor: 'var(--card-background)',
                    border: '1px solid var(--border-color)',
                    borderRadius: 'var(--radius)',
                    // boxShadow: 'var(--shadow)',
                    marginBottom: '2rem',
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
                        margin: '0 auto 1.5rem',
                        color: 'var(--primary-color)',
                        opacity: 0.7
                      }}
                    >
                      <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                    <h3 style={{ 
                      fontSize: '1.5rem', 
                      fontWeight: 700, 
                      marginBottom: '1rem',
                      color: 'var(--text-color)'
                    }}>
                      Select a Measure to View Data
                    </h3>
                    <p style={{ 
                      color: 'var(--text-secondary)', 
                      maxWidth: '500px', 
                      margin: '0 auto',
                      fontSize: '0.875rem',
                      lineHeight: 1.6
                    }}>
                      Now select a measure from the dropdown above to view the readings data.
                      The chart and table will display data from the last 24 hours.
                    </p>
                  </div>
                )}
              </>
            ) : (
              <div style={{ 
                textAlign: 'center',
                padding: '3rem 1.5rem',
                backgroundColor: 'var(--card-background)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius)',
                // boxShadow: 'var(--shadow)',
                marginBottom: '2rem',
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
                    margin: '0 auto 1.5rem',
                    color: 'var(--primary-color)',
                    opacity: 0.7
                  }}
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                  <circle cx="12" cy="10" r="3"></circle>
                </svg>
                <h3 style={{ 
                  fontSize: '1.3rem', 
                  // fontWeight: 700, 
                  marginBottom: '1rem',
                  color: 'var(--text-color)'
                }}>
                  Select a Station to Begin
                </h3>
                <p style={{ 
                  color: 'var(--text-secondary)', 
                  maxWidth: '500px', 
                  margin: '0 auto',
                  fontSize: '0.875rem',
                  lineHeight: 1.6
                }}>
                  Choose a measurement station from the sidebar to view available measures and readings data.
                  You can search for stations by name, river, or town.
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
