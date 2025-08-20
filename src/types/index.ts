export interface QuarterlyDeviation {
  vesselId: number;
  vesselName: string;
  quarter: string;
  year: number;
  actualEmissions: number;
  baselineEmissions: number;
  deviationPercentage: number;
  date: string;
}

export interface Vessel {
  id: number;
  name: string;
  imoNo: number;
  vesselType: number;
}

export type QuarterlyDataType = {
  quarter: string;
  year: number;
  date: string;
  totalEmissions: number;
};

export interface SummaryCardData {
  title: string;
  value: string | number;
  textColor?: string;
}
