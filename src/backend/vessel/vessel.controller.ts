import { Controller, Get, Param } from '@nestjs/common';
import { VesselService } from './vessel.service';
import { QuarterlyDeviation } from '@/types';

@Controller('api/vessels')
export class VesselController {
  constructor(private readonly vesselService: VesselService) {}

  @Get()
  async getVessels() {
    return this.vesselService.getVessels();
  }

  @Get('deviations')
  async getQuarterlyDeviations(): Promise<QuarterlyDeviation[]> {
    return this.vesselService.getQuarterlyDeviations();
  }

  // For further features
  @Get(':id/emissions')
  async getVesselEmissions(@Param('id') id: string) {
    return this.vesselService.getVesselEmissions(parseInt(id));
  }
}
