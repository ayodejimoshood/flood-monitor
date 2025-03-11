import { useState, useEffect, useRef } from 'react';
import { Station } from '../types';
import { getStations } from '../api';

interface StationSelectorProps {
  onStationSelect: (station: Station) => void;
}

export default function StationSelector({ onStationSelect }: StationSelectorProps) {
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedStation, setSelectedStation] = useState<Station | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        setLoading(true);
        const stationsData = await getStations();
        // Sort stations alphabetically by label
        const sortedStations = stationsData.sort((a, b) => a.label.localeCompare(b.label));
        setStations(sortedStations);
        setLoading(false);
      } catch (err) {
        setError('Failed to load stations. Please try again later.');
        setLoading(false);
      }
    };

    fetchStations();
  }, []);

  useEffect(() => {
    // Close dropdown when clicking outside
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filteredStations = stations.filter(station => 
    station.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (station.riverName && station.riverName.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (station.town && station.town.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleStationSelect = (station: Station) => {
    setSelectedStation(station);
    setSearchTerm(station.label);
    setIsDropdownOpen(false);
    onStationSelect(station);
  };

  if (loading) {
    return <div className="loading">Loading stations...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="card">
      <h2>
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg>
        Select a Measurement Station
      </h2>
      
      <div className="form-group" ref={dropdownRef}>
        <label htmlFor="station-search">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          Search and select a station
        </label>
        
        <div style={{ position: 'relative' }}>
          <input
            id="station-search"
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsDropdownOpen(true);
            }}
            onClick={() => setIsDropdownOpen(true)}
            placeholder="Search by station name, river, or town..."
            style={{ paddingLeft: '2.5rem' }}
            aria-expanded={isDropdownOpen}
            aria-autocomplete="list"
            aria-controls="station-dropdown"
          />
          
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
            style={{ 
              position: 'absolute', 
              left: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)'
            }}
          >
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
          
          {searchTerm && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setSelectedStation(null);
                setIsDropdownOpen(true);
              }}
              style={{ 
                position: 'absolute', 
                right: '2.5rem', 
                top: '50%', 
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)'
              }}
              aria-label="Clear search"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          )}
          
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            style={{ 
              position: 'absolute', 
              right: '1rem', 
              top: '50%', 
              transform: 'translateY(-50%)',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--text-secondary)'
            }}
            aria-label={isDropdownOpen ? "Close dropdown" : "Open dropdown"}
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              style={{
                transform: isDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease'
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          
          {isDropdownOpen && (
            <div 
              id="station-dropdown"
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                right: 0,
                maxHeight: '300px',
                overflowY: 'auto',
                backgroundColor: 'var(--card-background)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                boxShadow: 'var(--shadow)',
                zIndex: 10
              }}
            >
              {filteredStations.length === 0 ? (
                <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                  No stations found matching "{searchTerm}"
                </div>
              ) : (
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {filteredStations.slice(0, 100).map((station) => (
                    <li 
                      key={station.stationReference}
                      onClick={() => handleStationSelect(station)}
                      style={{ 
                        padding: '0.75rem 1rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid var(--border-color)',
                        transition: 'background-color 0.2s ease',
                        backgroundColor: selectedStation?.stationReference === station.stationReference 
                          ? 'rgba(59, 130, 246, 0.1)' 
                          : 'transparent'
                      }}
                      onMouseOver={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.05)';
                      }}
                      onMouseOut={(e) => {
                        if (selectedStation?.stationReference !== station.stationReference) {
                          e.currentTarget.style.backgroundColor = 'transparent';
                        } else {
                          e.currentTarget.style.backgroundColor = 'rgba(59, 130, 246, 0.1)';
                        }
                      }}
                      role="option"
                      aria-selected={selectedStation?.stationReference === station.stationReference}
                    >
                      <div style={{ fontWeight: 500 }}>{station.label}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                        {station.riverName && <span>River: {station.riverName}</span>}
                        {station.riverName && station.town && <span> • </span>}
                        {station.town && <span>Town: {station.town}</span>}
                      </div>
                    </li>
                  ))}
                  {filteredStations.length > 100 && (
                    <li style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                      Showing 100 of {filteredStations.length} results. Refine your search to see more.
                    </li>
                  )}
                </ul>
              )}
            </div>
          )}
        </div>
        
        <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.5rem', display: 'flex', justifyContent: 'space-between' }}>
          <span>{stations.length} stations available</span>
          {filteredStations.length < stations.length && (
            <span>{filteredStations.length} matches found</span>
          )}
        </div>
      </div>
      
      {selectedStation && (
        <div className="station-info">
          <h3 style={{ marginBottom: '0.75rem', color: 'var(--primary-color)' }}>
            {selectedStation.label}
          </h3>
          <div className="info-row">
            <div className="info-label">River:</div>
            <div className="info-value">{selectedStation.riverName || 'N/A'}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Town:</div>
            <div className="info-value">{selectedStation.town || 'N/A'}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Catchment:</div>
            <div className="info-value">{selectedStation.catchmentName || 'N/A'}</div>
          </div>
          <div className="info-row">
            <div className="info-label">Coordinates:</div>
            <div className="info-value">{selectedStation.lat.toFixed(5)}, {selectedStation.long.toFixed(5)}</div>
          </div>
          {selectedStation.dateOpened && (
            <div className="info-row">
              <div className="info-label">Date Opened:</div>
              <div className="info-value">{new Date(selectedStation.dateOpened).toLocaleDateString()}</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
} 