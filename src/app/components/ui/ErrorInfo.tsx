interface ErrorProps {
  title?: string;
  message: string;
  subtitle?: string;
}

export default function ErrorInfo({
  title = 'Error Loading Data',
  message,
  subtitle,
}: ErrorProps) {
  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
      <h3 className="text-red-800 font-semibold mb-2">{title}</h3>
      <p className="text-red-600">{message}</p>
      {subtitle && <p className="text-sm text-red-500 mt-2">{subtitle}</p>}
    </div>
  );
}
