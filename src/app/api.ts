import axios from 'axios';
import { StationsResponse, MeasuresResponse, ReadingsResponse } from './types';

const BASE_URL = 'https://environment.data.gov.uk/flood-monitoring';

// Get all stations
export const getStations = async () => {
  try {
    const response = await axios.get<StationsResponse>(`${BASE_URL}/id/stations`, {
      params: {
        _limit: 1000 // Get a reasonable number of stations
      }
    });
    return response.data.items;
  } catch (error) {
    console.error('Error fetching stations:', error);
    throw error;
  }
};

// Get measures for a specific station
export const getStationMeasures = async (stationId: string) => {
  try {
    const response = await axios.get<MeasuresResponse>(`${BASE_URL}/id/stations/${stationId}/measures`);
    return response.data.items;
  } catch (error) {
    console.error(`Error fetching measures for station ${stationId}:`, error);
    throw error;
  }
};

// Get readings for a specific measure over the last 24 hours
export const getMeasureReadings = async (measureId: string) => {
  try {
    // Get the current date and the date 24 hours ago
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Format dates for the API
    const startDate = yesterday.toISOString();
    
    const response = await axios.get<ReadingsResponse>(`${BASE_URL}/id/measures/${measureId}/readings`, {
      params: {
        since: startDate,
        _sorted: true
      }
    });
    return response.data.items;
  } catch (error) {
    console.error(`Error fetching readings for measure ${measureId}:`, error);
    throw error;
  }
};

// Get all readings for a station over the last 24 hours
export const getStationReadings = async (stationId: string) => {
  try {
    // Get the current date and the date 24 hours ago
    const now = new Date();
    const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000);
    
    // Format dates for the API
    const startDate = yesterday.toISOString();
    
    const response = await axios.get<ReadingsResponse>(`${BASE_URL}/id/stations/${stationId}/readings`, {
      params: {
        since: startDate,
        _sorted: true
      }
    });
    return response.data.items;
  } catch (error) {
    console.error(`Error fetching readings for station ${stationId}:`, error);
    throw error;
  }
}; 