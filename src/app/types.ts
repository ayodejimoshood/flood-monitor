// Station types
export interface Station {
  '@id': string;
  RLOIid?: string;
  catchmentName?: string;
  dateOpened?: string;
  easting?: number;
  gridReference?: string;
  label: string;
  lat: number;
  long: number;
  northing?: number;
  notation: string;
  riverName?: string;
  stageScale?: StageScale;
  stationReference: string;
  status?: string;
  town?: string;
  wiskiID?: string;
}

export interface StageScale {
  '@id': string;
  datum?: number;
  highestRecent?: number;
  maxOnRecord?: number;
  minOnRecord?: number;
  scaleMax?: number;
  typicalRangeHigh?: number;
  typicalRangeLow?: number;
}

// Measure types
export interface Measure {
  '@id': string;
  parameter: string;
  parameterName: string;
  period?: number;
  qualifier?: string;
  unitName: string;
  latestReading?: Reading;
  notation?: string;
  station?: string;
  valueType?: string;
  stationReference?: string;
}

// Reading types
export interface Reading {
  '@id': string;
  date: string;
  dateTime: string;
  measure: string;
  value: number;
}

// API response types
export interface StationsResponse {
  '@context': string;
  meta: {
    publisher: string;
    licence: string;
    documentation: string;
    version: string;
    comment: string;
    hasFormat: string[];
    limit: number;
  };
  items: Station[];
}

export interface MeasuresResponse {
  '@context': string;
  meta: {
    publisher: string;
    licence: string;
    documentation: string;
    version: string;
    comment: string;
    hasFormat: string[];
  };
  items: Measure[];
}

export interface ReadingsResponse {
  '@context': string;
  meta: {
    publisher: string;
    licence: string;
    documentation: string;
    version: string;
    comment: string;
    hasFormat: string[];
  };
  items: Reading[];
} 