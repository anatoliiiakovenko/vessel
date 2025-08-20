'use client';

import { useVesselData } from '@/app/hooks/useVesselData';
import SummaryCards from './SummaryCards';
import VesselList from './VesselList';
import VesselChart from './VesselChart';

export default function VesselDashboard() {
  const { deviations, vessels, loading, error } = useVesselData();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-4 text-lg">Loading vessel data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <h3 className="text-red-800 font-semibold mb-2">Error Loading Data</h3>
        <p className="text-red-600">{error}</p>
        <p className="text-sm text-red-500 mt-2">
          Make sure the NestJS backend is running on http://localhost:3001
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <SummaryCards vessels={vessels} deviations={deviations} />
      <VesselChart vessels={vessels} deviations={deviations} />
      <VesselList vessels={vessels} deviations={deviations} />
    </div>
  );
}
