import VesselDashboard from './components/Dashboard/VesselDashboard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-800">
          Vessel Emissions Visualization
        </h1>
        <p className="text-lg text-center mb-12 text-gray-600 max-w-3xl mx-auto">
          Monitor vessel emissions deviations from Poseidon Principles minimum
          baselines. Data shows quarterly performance for the last day of each
          quarter.
        </p>
        <VesselDashboard />
      </div>
    </main>
  );
}
