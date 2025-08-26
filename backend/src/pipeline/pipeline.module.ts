import { Module } from '@nestjs/common';
import { VaccinationsModule } from '../vaccinations/vaccinations.module';
import { PipelineController } from './pipeline.controller';
import { PipelineService } from './pipeline.service';

@Module({
  imports: [VaccinationsModule],
  controllers: [PipelineController],
  providers: [PipelineService],
})
export class PipelineModule {}