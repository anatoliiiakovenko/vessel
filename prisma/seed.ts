import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Read JSON files
  const vesselsPath = path.join(__dirname, '../src/static/vessels.json');
  const ppReferencePath = path.join(
    __dirname,
    '../src/static/pp-reference.json'
  );
  const emissionsPath = path.join(
    __dirname,
    '../src/static/daily-log-emissions.json'
  );

  const vessels = JSON.parse(fs.readFileSync(vesselsPath, 'utf8'));
  const ppReference = JSON.parse(fs.readFileSync(ppReferencePath, 'utf8'));
  const emissions = JSON.parse(fs.readFileSync(emissionsPath, 'utf8'));

  console.log(
    `Found ${vessels.length} vessels, ${ppReference.length} PP references, ${emissions.length} emissions records`
  );

  // Clear existing data
  console.log('🧹 Clearing existing data...');
  await prisma.dailyLogEmission.deleteMany();
  await prisma.vessel.deleteMany();
  await prisma.cE_PPSCCReferenceLine.deleteMany();

  // Seed vessels
  console.log('🚢 Seeding vessels...');
  for (const vessel of vessels) {
    await prisma.vessel.create({
      data: {
        name: vessel.Name,
        imoNo: vessel.IMONo,
        vesselType: vessel.VesselType,
      },
    });
  }

  // Seed PP reference data
  console.log('📈 Seeding PP reference data...');
  for (const ref of ppReference) {
    await prisma.cE_PPSCCReferenceLine.create({
      data: {
        rowId: ref.RowID,
        category: ref.Category,
        vesselTypeId: ref.VesselTypeID,
        size: ref.Size,
        traj: ref.Traj,
        a: ref.a,
        b: ref.b,
        c: ref.c,
        d: ref.d,
        e: ref.e,
      },
    });
  }

  // Seed emissions data (in batches for performance)
  console.log('Seeding emissions data...');
  const batchSize = 1000;
  for (let i = 0; i < emissions.length; i += batchSize) {
    const batch = emissions.slice(i, i + batchSize);
    const emissionsData = batch.map((emission: any) => ({
      vesselId: emission.VesselID,
      logId: BigInt(emission.LOGID),
      fromUTC: new Date(emission.FromUTC),
      toUTC: new Date(emission.TOUTC),
      metTwCo2: emission.MET2WCO2,
      aetTwCo2: emission.AET2WCO2,
      botTwCo2: emission.BOT2WCO2,
      vrtTwCo2: emission.VRT2WCO2,
      totTwCo2: emission.TotT2WCO2,
      mewTwCo2e: emission.MEW2WCO2e,
      aewTwCo2e: emission.AEW2WCO2e,
      bowTwCo2e: emission.BOW2WCO2e,
      vrwTwCo2e: emission.VRW2WCO2e,
      totWtwCo2: emission.ToTW2WCO2,
      meSox: emission.MESox,
      aeSox: emission.AESox,
      boSox: emission.BOSox,
      vrSox: emission.VRSox,
      totSox: emission.TotSOx,
      meNox: emission.MENOx,
      aeNox: emission.AENOx,
      totNox: emission.TotNOx,
      mePm10: emission.MEPM10,
      aePm10: emission.AEPM10,
      totPm10: emission.TotPM10,
      aerCo2Ttw: emission.AERCO2T2W,
      aerCo2eWtw: emission.AERCO2eW2W,
      eeoiCo2eWtw: emission.EEOICO2eW2W,
      createdAt: new Date(emission.CreatedAt),
      updatedAt: new Date(emission.UpdatedAt),
    }));

    await prisma.dailyLogEmission.createMany({
      data: emissionsData,
    });

    console.log(
      `   Processed batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(emissions.length / batchSize)}`
    );
  }

  console.log('Database seeded successfully!');
}

main()
  .catch(e => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
