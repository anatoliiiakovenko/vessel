# Vessel Emissions Visualization

A comprehensive solution for visualizing vessel emissions data and calculating deviations from Poseidon Principles minimum baselines.

## Tech Stack

- **Frontend**: NextJS 15 with React 19, TailwindCSS
- **Backend**: NestJS
- **Database**: PostgreSQL with Prisma ORM
- **UI library**: Highcharts
- **Language**: TypeScript

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Database Setup

Create a PostgreSQL database and set up your environment variables:

```bash
# Create .env file in project root
echo "DATABASE_URL=\"postgresql://username:password@localhost:5432/vessel_emissions?schema=public\"" > .env
```

### 3. Initialize Database

```bash
# Generate Prisma client
npm run db:generate

# Push schema to database
npm run db:push

# Seed database with JSON data
npm run db:seed
```

### 4. Start the Application

Open two terminal windows:

**Terminal 1 - Backend (NestJS):**

```bash
npm run backend:dev
```

**Terminal 2 - Frontend (NextJS):**

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## API Endpoints

- `GET /api/vessels` - Get all vessels
- `GET /api/vessels/deviations` - Get quarterly deviation calculations
- `GET /api/vessels/:id/emissions` - Get emissions data for specific vessel

## Key Features Explained

### Deviation Calculation

The system calculates percentage deviations from Poseidon Principles minimum baselines:

1. **Quarterly Grouping**: Emissions data is grouped by year and quarter
2. **Last Day Selection**: For each quarter, the last day's emissions are used
3. **Baseline Calculation**: Uses the provided `calculatePPSCCBaselines` utility
4. **Deviation Formula**: `((actual - baseline) / baseline) * 100`

### Visualization

- **Line Chart**: Shows deviation trends over time for all vessels
- **Interactive Tooltips**: Display detailed information on hover
- **Baseline Reference**: Red dashed line at 0% deviation
- **Responsive Design**: Works on desktop and mobile devices

## Data Sources

- **vessels.json**: Basic vessel information (Name, IMO, VesselType)
- **daily-log-emissions.json**: Daily emissions data with multiple emission types
- **pp-reference.json**: Poseidon Principles reference coefficients for calculations

## Development Notes

- The system assumes a DWT of 50,000 for baseline calculations (should be vessel-specific in production)
- Emissions data uses Well-to-Wake CO2 totals (`ToTW2WCO2`) for calculations
- The frontend handles backend connection errors gracefully
- Database seeding processes large datasets in batches for performance
