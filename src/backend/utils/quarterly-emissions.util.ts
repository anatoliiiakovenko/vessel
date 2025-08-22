import { DailyLogEmission } from '@prisma/client';
import { QuarterlyDataType } from '../types';

export function getQuarterlyLastDayEmissions(
  emissions: DailyLogEmission[]
): QuarterlyDataType[] {
  const quarterlyData: QuarterlyDataType[] = [];

  const grouped = emissions.reduce(
    (acc, emission) => {
      const date = new Date(emission.toUTC);
      const year = date.getFullYear();
      const quarter = Math.ceil((date.getMonth() + 1) / 3);
      const key = `${year}-Q${quarter}`;

      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(emission);
      return acc;
    },
    {} as Record<string, DailyLogEmission[]>
  );

  // For each quarter, find the last day and sum emissions
  Object.keys(grouped).forEach(key => {
    const quarterEmissions = grouped[key];
    const [year, quarter] = key.split('-');

    // Sort by date and get the last day's emissions
    const sortedEmissions = quarterEmissions.sort(
      (a: DailyLogEmission, b: DailyLogEmission) =>
        new Date(b.toUTC).getTime() - new Date(a.toUTC).getTime()
    );

    const lastDayEmission = sortedEmissions[0];

    quarterlyData.push({
      quarter,
      year: parseInt(year),
      date: lastDayEmission.toUTC.toISOString(),
      totalEmissions: lastDayEmission.totWtwCo2,
    });
  });

  return quarterlyData;
}
