import { Module } from '@nestjs/common';
import { PrismaModule } from './prisma/prisma.module';
import { VesselModule } from './vessel/vessel.module';

@Module({
  imports: [PrismaModule, VesselModule],
})
export class AppModule {}
