import { Module } from '@nestjs/common';
import { VesselController } from './vessel.controller';
import { VesselService } from './vessel.service';

@Module({
  controllers: [VesselController],
  providers: [VesselService],
})
export class VesselModule {}
