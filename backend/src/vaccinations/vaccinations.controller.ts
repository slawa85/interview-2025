import { Controller, Get, Param } from '@nestjs/common';
import { VaccinationsService } from './vaccinations.service';
import { Vaccination } from './vaccination.entity';

@Controller('vaccinations')
export class VaccinationsController {
  constructor(private readonly vaccinationsService: VaccinationsService) {}

  @Get()
  async getLatestVaccinations(): Promise<Vaccination[]> {
    return this.vaccinationsService.getLatestVaccinationPerPet();
  }

  @Get('pet/:petId')
  async getVaccinationsForPet(
    @Param('petId') petId: number,
  ): Promise<Vaccination[]> {
    return this.vaccinationsService.getVaccinationsForPet(petId);
  }

  @Get('stats')
  async getVaccinationStats(): Promise<{
    totalVaccinations: number;
    uniquePets: number;
    latestUpdate: string | null;
  }> {
    return this.vaccinationsService.getVaccinationStats();
  }

  @Get('all')
  async getAllVaccinations(): Promise<Vaccination[]> {
    return this.vaccinationsService.getAllVaccinations();
  }
}