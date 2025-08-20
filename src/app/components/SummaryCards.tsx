import { QuarterlyDeviation, Vessel } from '@/types';

interface SummaryCardsProps {
  vessels: Vessel[];
  deviations: QuarterlyDeviation[];
}

export default function SummaryCards({ vessels, deviations }: SummaryCardsProps) {
  const avgDeviation = deviations.length > 0
    ? (deviations.reduce((sum, d) => sum + d.deviationPercentage, 0) / deviations.length).toFixed(1)
    : '0';

  const aboveBaselineCount = deviations.filter(d => d.deviationPercentage > 0).length;

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Total Vessels</h3>
        <p className="text-2xl font-bold text-gray-900">{vessels.length}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Data Points</h3>
        <p className="text-2xl font-bold text-gray-900">{deviations.length}</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Avg Deviation</h3>
        <p className="text-2xl font-bold text-gray-900">{avgDeviation}%</p>
      </div>
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-sm font-medium text-gray-500">Above Baseline</h3>
        <p className="text-2xl font-bold text-red-600">{aboveBaselineCount}</p>
      </div>
    </div>
  );
}
