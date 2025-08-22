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

export type QuarterlyDataType = {
  quarter: string;
  year: number;
  date: string;
  totalEmissions: number;
};
