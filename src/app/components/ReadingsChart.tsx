import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { Measure, Reading } from '../types';
import { getMeasureReadings } from '../api';
import WaterLevelAnimation from './WaterLevelAnimation';

interface ReadingsChartProps {
  measure: Measure;
}

export default function ReadingsChart({ measure }: ReadingsChartProps) {
  const [readings, setReadings] = useState<Reading[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [currentReading, setCurrentReading] = useState<number | null>(null);

  useEffect(() => {
    const fetchReadings = async () => {
      try {
        setLoading(true);
        // Use the full measure ID - the API will handle extracting the ID if needed
        const readingsData = await getMeasureReadings(measure['@id']);
        setReadings(readingsData);
        
        // Set the current reading to the most recent value
        if (readingsData.length > 0) {
          setCurrentReading(readingsData[readingsData.length - 1].value);
        }
        
        setLoading(false);
      } catch (error) {
        setError('Failed to load readings. Please try again later.');
        console.error('Error fetching readings:', error);
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
          marginBottom: '1rem'
        }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem' }}>
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
          </svg>
          No readings available for this measure in the last 24 hours.
        </div>
      </div>
    );
  }

  // Process the data for the chart
  const chartData = readings.map(reading => ({
    time: new Date(reading.dateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    value: reading.value,
    fullDateTime: reading.dateTime
  }));

  // Calculate statistics
  const values = readings.map(r => r.value);
  const maxValue = Math.max(...values);
  const minValue = Math.min(...values);
  const avgValue = values.reduce((a, b) => a + b, 0) / values.length;
  const padding = (maxValue - minValue) * 0.1; // Add 10% padding to the y-axis

  // Format dates for display
  const firstReading = new Date(readings[0].dateTime);
  const lastReading = new Date(readings[readings.length - 1].dateTime);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ margin: 0, fontSize: '1.3rem' }}>
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '0.5rem', verticalAlign: 'middle' }}>
            <path d="M3 3v18h18"></path>
            <path d="M18.4 8.64 8.78 18.26"></path>
            <path d="m14.51 12.53 3.89-3.89"></path>
            <path d="M8.78 18.26 5.13 16"></path>
          </svg>
          Readings for the Last 24 Hours
        </h2>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Min</div>
            <div style={{ fontWeight: 600 }}>{minValue.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Avg</div>
            <div style={{ fontWeight: 600 }}>{avgValue.toFixed(2)}</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Max</div>
            <div style={{ fontWeight: 600 }}>{maxValue.toFixed(2)}</div>
          </div>
        </div>
      </div>
      
      <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
        From {firstReading.toLocaleString()} to {lastReading.toLocaleString()} • {readings.length} readings
      </div>
      
      <div style={{ 
        width: '100%', 
        height: 400, 
        backgroundColor: 'rgba(59, 130, 246, 0.03)', 
        borderRadius: 'var(--radius-sm)', 
        padding: '1rem 0',
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Add the water level animation */}
        {currentReading !== null && (
          <WaterLevelAnimation 
            currentLevel={currentReading} 
            maxLevel={maxValue + padding} 
            minLevel={Math.max(0, minValue - padding)}
            isLoading={loading}
          />
        )}
        
        <ResponsiveContainer>
          <LineChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
            onMouseMove={(e) => {
              if (e.activePayload && e.activePayload.length > 0) {
                setCurrentReading(e.activePayload[0].payload.value);
              }
            }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(203, 213, 225, 0.5)" />
            <XAxis 
              dataKey="time" 
              angle={-45} 
              textAnchor="end"
              height={70}
              interval="preserveStartEnd"
              tickFormatter={(time) => time}
              stroke="var(--text-secondary)"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <YAxis 
              domain={[
                Math.max(0, minValue - padding), 
                maxValue + padding
              ]} 
              label={{ 
                value: measure.unitName, 
                angle: -90, 
                position: 'insideLeft',
                style: { fill: 'var(--text-secondary)', fontSize: 12 }
              }}
              stroke="var(--text-secondary)"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: 'var(--card-background)', 
                borderColor: 'var(--border-color)',
                borderRadius: 'var(--radius-sm)',
                // boxShadow: 'var(--shadow)'
              }}
              formatter={(value, name, props) => {
                return [
                  <span key="value">{value} {measure.unitName}</span>,
                  <span key="label">{measure.parameterName}</span>
                ];
              }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0) {
                  const date = new Date(payload[0].payload.fullDateTime);
                  return date.toLocaleString();
                }
                return label;
              }}
            />
            <Legend 
              wrapperStyle={{ paddingTop: '1rem' }}
              formatter={() => (
                <span style={{ color: 'var(--text-color)', fontSize: '0.875rem' }}>
                  {measure.parameterName} ({measure.unitName})
                </span>
              )}
            />
            
            {/* Add reference line for average */}
            <ReferenceLine 
              y={avgValue} 
              stroke="var(--secondary-color)" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Average', 
                position: 'insideBottomRight',
                fill: 'var(--secondary-color)',
                fontSize: 12
              }} 
            />
            <Line 
              key="reading-line"
              type="monotone" 
              dataKey="value" 
              name={measure.parameterName} 
              stroke="var(--primary-color)" 
              strokeWidth={2}
              activeDot={{ r: 8, fill: 'var(--primary-color)', stroke: 'white', strokeWidth: 2 }} 
              dot={{ r: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 