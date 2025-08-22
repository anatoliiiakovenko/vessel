import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { calculatePPSCCBaselines } from '../utils/calculate-pp-scc-baselines.util';
import Decimal from 'decimal.js/decimal';
import { QuarterlyDeviation } from '../types';
import { getQuarterlyLastDayEmissions } from '../utils/quarterly-emissions.util';

@Injectable()
export class VesselService {
  constructor(private prisma: PrismaService) {}

  async getVessels() {
    return this.prisma.vessel.findMany({
      select: {
        id: true,
        name: true,
        imoNo: true,
        vesselType: true,
      },
    });
  }

  async getQuarterlyDeviations(): Promise<QuarterlyDeviation[]> {
    const vessels = await this.prisma.vessel.findMany();
    const ppReferences = await this.prisma.cE_PPSCCReferenceLine.findMany();

    const deviations: QuarterlyDeviation[] = [];

    for (const vessel of vessels) {
      const emissions = await this.prisma.dailyLogEmission.findMany({
        where: { vesselId: vessel.imoNo },
        orderBy: { toUTC: 'asc' },
      });

      const quarterlyData = getQuarterlyLastDayEmissions(emissions);

      for (const quarterData of quarterlyData) {
        try {
          const vesselTypeFactors = ppReferences.filter(
            ref =>
              ref.vesselTypeId === vessel.vesselType &&
              ref.category.toUpperCase() === 'PP'
          );

          if (vesselTypeFactors.length === 0) {
            console.warn(
              `No PP reference factors found for vessel type ${vessel.vesselType}`
            );
            continue;
          }

          const baselines = calculatePPSCCBaselines({
            factors: vesselTypeFactors,
            year: quarterData.year,
            DWT: new Decimal(50000),
          });

          const actualEmissions = quarterData.totalEmissions;
          const baselineEmissions = baselines.min.toNumber();
          const deviationPercentage =
            ((actualEmissions - baselineEmissions) / baselineEmissions) * 100;

          deviations.push({
            vesselId: vessel.imoNo,
            vesselName: vessel.name,
            quarter: quarterData.quarter,
            year: quarterData.year,
            actualEmissions,
            baselineEmissions,
            deviationPercentage,
            date: quarterData.date,
          });
        } catch (error) {
          console.error(
            `Error calculating deviation for vessel ${vessel.name}:`,
            error
          );
        }
      }
    }

    return deviations.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }

  async getVesselEmissions(vesselId: number) {
    return this.prisma.dailyLogEmission.findMany({
      where: { vesselId },
      include: { vessel: true },
      orderBy: { toUTC: 'asc' },
    });
  }
}
