import { QuarterlyDeviation, SummaryCardData, Vessel } from '@/types';
import SummaryCard from './SummaryCard';

interface SummaryCardsProps {
  vessels: Vessel[];
  deviations: QuarterlyDeviation[];
}

export default function SummaryCardsBar({
  vessels,
  deviations,
}: SummaryCardsProps) {
  const avgDeviation =
    deviations.length > 0
      ? (
          deviations.reduce((sum, d) => sum + d.deviationPercentage, 0) /
          deviations.length
        ).toFixed(1)
      : '0';

  const aboveBaselineCount = deviations.filter(
    d => d.deviationPercentage > 0
  ).length;

  const cardData: SummaryCardData[] = [
    {
      title: 'Total Vessels',
      value: vessels.length,
    },
    {
      title: 'Data Points',
      value: deviations.length,
    },
    {
      title: 'Avg Deviation',
      value: `${avgDeviation}%`,
    },
    {
      title: 'Above Baseline',
      value: aboveBaselineCount,
      textColor: 'text-red-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      {cardData.map(card => (
        <SummaryCard
          key={card.title}
          title={card.title}
          value={card.value}
          textColor={card.textColor}
        />
      ))}
    </div>
  );
}
