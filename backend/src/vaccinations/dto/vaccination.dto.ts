export class VaccinationDto {
  id?: number;
  petId: number;
  visitId: number;
  visitDate: string;
  vaccinationType: string;
  rawRecordId: number;
  extractedText: string;
  createdAt?: string;
  updatedAt?: string;
}