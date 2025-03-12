import { useState, useEffect } from 'react';
import { Measure, Reading } from '../types';
import { getMeasureReadings } from '../api';

interface ReadingsTableProps {
  measure: Measure;
}

export default function ReadingsTable({ measure }: ReadingsTableProps) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [itemsPerPage] = useState<number>(10);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setLoading(true);
        // Extract measure ID from the URL
        const measureId = measure['@id'].split('/').pop();
        if (!measureId) {
          throw new Error('Invalid measure ID');
        }
        
        const readingsData = await getMeasureReadings(measureId);
        // Sort readings by dateTime in descending order (newest first)
        const sortedReadings = readingsData.sort((a, b) => 
          new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
        );
        setReadings(sortedReadings);
        setCurrentPage(1); // Reset to first page when measure changes
        setLoading(false);
      } catch (err) {
        setError('Failed to load readings. Please try again later.');
        setLoading(false);
      }
    };

    fetchReadings();
  }, [measure]);

  if (loading) {
    return <div className="loading">Loading readings data...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  if (readings.length === 0) {
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
          No readings available for this measure in the last 24 hours.
        </div>
      </div>
    );
  }

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReadings = readings.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(readings.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
            <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z"></path>
            <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9"></path>
            <path d="M12 3v6"></path>
          </svg>
          Readings Data Table
        </h2>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          backgroundColor: 'rgba(59, 130, 246, 0.1)', 
          padding: '0.5rem 0.75rem', 
          borderRadius: 'var(--radius-lg)',
          fontSize: '0.875rem',
          color: 'var(--primary-color)',
          fontWeight: 500
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
            <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
            <circle cx="9" cy="7" r="4"></circle>
            <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
            <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
          </svg>
          Total: {readings.length} readings
        </div>
      </div>
      
      <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
        <table style={{ margin: 0 }}>
          <thead>
            <tr>
              <th style={{ width: '60%' }}>Date & Time</th>
              <th style={{ width: '40%' }}>Value ({measure.unitName})</th>
            </tr>
          </thead>
          <tbody>
            {currentReadings.map((reading) => (
              <tr key={reading['@id']}>
                <td>{new Date(reading.dateTime).toLocaleString()}</td>
                <td style={{ fontWeight: 500 }}>{reading.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="btn" 
            onClick={() => paginate(currentPage - 1)} 
            disabled={currentPage === 1}
            style={{ padding: '0.25rem 0.5rem' }}
            aria-label="Previous page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"></path>
            </svg>
          </button>
          
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter(page => 
                page === 1 || 
                page === totalPages || 
                (page >= currentPage - 1 && page <= currentPage + 1)
              )
              .map((page, index, array) => {
                // Add ellipsis
                if (index > 0 && array[index - 1] !== page - 1) {
                  return (
                    <span key={`ellipsis-${page}`} style={{ 
                      margin: '0 0.25rem', 
                      display: 'flex', 
                      alignItems: 'center',
                      color: 'var(--text-secondary)'
                    }}>...</span>
                  );
                }
                
                return (
                  <button
                    key={page}
                    onClick={() => paginate(page)}
                    className="btn"
                    style={{
                      padding: '0.25rem 0.5rem',
                      backgroundColor: currentPage === page ? 'var(--primary-dark)' : 'var(--primary-color)',
                      minWidth: '2.5rem'
                    }}
                    aria-label={`Page ${page}`}
                    aria-current={currentPage === page ? 'page' : undefined}
                  >
                    {page}
                  </button>
                );
              })}
          </div>
          
          <button 
            className="btn" 
            onClick={() => paginate(currentPage + 1)} 
            disabled={currentPage === totalPages}
            style={{ padding: '0.25rem 0.5rem' }}
            aria-label="Next page"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"></path>
            </svg>
          </button>
        </div>
      )}
      
      <div style={{ 
        fontSize: '0.75rem', 
        color: 'var(--text-secondary)', 
        textAlign: 'center',
        marginTop: '0.5rem'
      }}>
        Showing {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, readings.length)} of {readings.length} readings
      </div>
    </div>
  );
} 