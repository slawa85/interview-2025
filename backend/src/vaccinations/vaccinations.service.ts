import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vaccination } from './vaccination.entity';

@Injectable()
export class VaccinationsService {
  constructor(
    @InjectRepository(Vaccination)
    private vaccinationRepository: Repository<Vaccination>,
  ) {}

  async getLatestVaccinationPerPet(): Promise<Vaccination[]> {
    const query = `
      SELECT v.*
      FROM vaccinations v
      INNER JOIN (
        SELECT petId, MAX(visitDate) as maxVisitDate
        FROM vaccinations
        GROUP BY petId
      ) latest ON v.petId = latest.petId AND v.visitDate = latest.maxVisitDate
      ORDER BY v.visitDate DESC
    `;
    
    return this.vaccinationRepository.query(query);
  }

  async getVaccinationsForPet(petId: number): Promise<Vaccination[]> {
    return this.vaccinationRepository.find({
      where: { petId },
      order: { visitDate: 'DESC' },
    });
  }

  async getAllVaccinations(): Promise<Vaccination[]> {
    return this.vaccinationRepository.find({
      order: { visitDate: 'DESC' },
    });
  }

  async getVaccinationStats(): Promise<{
    totalVaccinations: number;
    uniquePets: number;
    latestUpdate: string | null;
  }> {
    const totalVaccinations = await this.vaccinationRepository.count();
    
    const uniquePetsResult = await this.vaccinationRepository
      .createQueryBuilder('vaccination')
      .select('COUNT(DISTINCT vaccination.petId)', 'count')
      .getRawOne();
    
    const latestRecord = await this.vaccinationRepository.findOne({
      where: {},
      order: { updatedAt: 'DESC' },
    });

    return {
      totalVaccinations,
      uniquePets: parseInt(uniquePetsResult.count),
      latestUpdate: latestRecord ? new Date().toISOString() : null,
    };
  }

  async saveVaccination(vaccination: Partial<Vaccination>): Promise<Vaccination> {
    const now = new Date().toISOString();
    const vaccinationEntity = this.vaccinationRepository.create({
      ...vaccination,
      createdAt: now,
      updatedAt: now,
    });
    return this.vaccinationRepository.save(vaccinationEntity);
  }
}