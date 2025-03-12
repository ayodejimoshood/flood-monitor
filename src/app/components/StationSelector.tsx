import { useState, useEffect, useRef } from 'react';
import { Station } from '../types';
import { getStations } from '../api';
import SearchInput from './SearchInput';

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
      } catch (error) {
        setError('Failed to load stations. Please try again later.');
        console.error('Error fetching stations:', error);
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
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div className="loading" style={{ height: '150px' }}>
          <span style={{ marginRight: '0.75rem', fontSize: '0.875rem', fontWeight: 500 }}>
            Loading stations
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem' }}>
        <div className="error" style={{ maxWidth: '500px', margin: '0 auto' }}>
          <div style={{ fontWeight: 600, marginBottom: '0.5rem' }}>Error</div>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '1.5rem' }}>
      <h2 style={{ 
        fontSize: '1.3rem', 
        // fontWeight: 700, 
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
      }}>
        {/* <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.75rem' }}>
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
          <circle cx="12" cy="10" r="3"></circle>
        </svg> */}
        Select a Measurement Station
      </h2>
      
      <div className="form-group" ref={dropdownRef}>
        <div style={{ 
          fontSize: '0.75rem', 
          color: 'var(--text-secondary)',
          marginTop: '0.75rem', 
          display: 'flex', 
          justifyContent: 'space-between',
          padding: '0 0.25rem'
        }}>
          <span>{stations.length} stations available</span>
          {filteredStations.length < stations.length && searchTerm && (
            <span>{filteredStations.length} matches found</span>
          )}
        </div>

        <SearchInput
          placeholder="Search by station name, river, or town..."
          value={searchTerm}
          onChange={(value) => {
            setSearchTerm(value);
            setIsDropdownOpen(true);
          }}
          onFocus={() => setIsDropdownOpen(true)}
          onClear={() => {
            setSelectedStation(null);
            setIsDropdownOpen(true);
          }}
          onToggleDropdown={() => setIsDropdownOpen(!isDropdownOpen)}
          isDropdownOpen={isDropdownOpen}
        />
          
        {isDropdownOpen && (
          <div 
            id="station-dropdown"
            className="select-dropdown"
            style={{ position: 'absolute', top: '100%', zIndex: 1000 }}
          >
            {filteredStations.length === 0 ? (
              <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ margin: '0 auto 0.75rem' }}>
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <div style={{ fontWeight: 500, marginBottom: '0.25rem' }}>No stations found</div>
                <div style={{ fontSize: '0.875rem' }}>Try a different search term</div>
              </div>
            ) : (
              <div className="select-options">
                {filteredStations.slice(0, 100).map((station) => (
                  <div 
                    key={station.stationReference}
                    onClick={() => handleStationSelect(station)}
                    className={`select-option ${selectedStation?.stationReference === station.stationReference ? 'active' : ''}`}
                    role="option"
                    aria-selected={selectedStation?.stationReference === station.stationReference}
                  >
                    <div style={{ fontWeight: 500 }}>{station.label}</div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {station.riverName && <span>River: {station.riverName}</span>}
                      {station.riverName && station.town && <span> • </span>}
                      {station.town && <span>Town: {station.town}</span>}
                    </div>
                  </div>
                ))}
                {filteredStations.length > 100 && (
                  <div style={{ padding: '0.75rem 1rem', textAlign: 'center', color: 'var(--text-secondary)', fontSize: '0.875rem', borderTop: '1px solid var(--border-color)' }}>
                    Showing 100 of {filteredStations.length} results. Refine your search to see more.
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
      
      {selectedStation && (
        <div style={{ 
          marginTop: '2rem',
          padding: '1.5rem',
          backgroundColor: 'var(--card-background)',
          borderRadius: 'var(--radius)',
          border: '1px solid var(--border-color)',
          boxShadow: 'var(--shadow-sm)'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'flex-start',
            marginBottom: '1rem'
          }}>
            <h3 style={{ 
              margin: 0, 
              fontSize: '0.85rem', 
              fontWeight: 600,
              color: 'var(--text-color)'
            }}>
              {selectedStation.label}
            </h3>
            <div className="badge">
              Selected Station
            </div>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
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
        </div>
      )}
    </div>
  );
} 