import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ScheduleModule } from '@nestjs/schedule';
import { VaccinationsModule } from './vaccinations/vaccinations.module';
import { PipelineModule } from './pipeline/pipeline.module';
import { Vaccination } from './vaccinations/vaccination.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    TypeOrmModule.forRoot({
      type: 'sqlite',
      database: process.env.DATABASE_PATH || 'vaccinations.db',
      entities: [Vaccination],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    VaccinationsModule,
    PipelineModule,
  ],
})
export class AppModule {}