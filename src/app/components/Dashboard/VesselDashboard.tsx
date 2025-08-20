'use client';

import { useVesselData } from '@/app/hooks/useVesselData';
import SummaryCardsBar from './SummaryCardsBar';
import VesselList from './VesselList';
import VesselChart from './VesselChart';
import Loader from '@/app/components/ui/Loader';
import ErrorInfo from '@/app/components/ui/ErrorInfo';

export default function VesselDashboard() {
  const { deviations, vessels, loading, error } = useVesselData();

  if (loading) {
    return <Loader message="Loading vessel data..." />;
  }

  if (error) {
    return (
      <ErrorInfo
        message={error}
        subtitle="Make sure the NestJS backend is running on http://localhost:3001"
      />
    );
  }

  return (
    <div className="space-y-8">
      <SummaryCardsBar vessels={vessels} deviations={deviations} />
      <VesselChart vessels={vessels} deviations={deviations} />
      <VesselList vessels={vessels} deviations={deviations} />
    </div>
  );
}
