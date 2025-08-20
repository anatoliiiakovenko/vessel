interface SummaryCardProps {
  title: string;
  value: string | number;
  textColor?: string;
}

export default function SummaryCard({
  title,
  value,
  textColor = 'text-gray-900',
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-sm font-medium text-gray-500">{title}</h3>
      <p className={`text-2xl font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
