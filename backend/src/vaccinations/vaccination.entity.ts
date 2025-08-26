import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('vaccinations')
@Index(['petId', 'visitDate'])
export class Vaccination {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index()
  petId: number;

  @Column()
  visitId: number;

  @Column('datetime')
  visitDate: string;

  @Column()
  vaccinationType: string;

  @Column()
  rawRecordId: number;

  @Column('text')
  extractedText: string;

  @Column('datetime')
  createdAt: string;

  @Column('datetime')
  updatedAt: string;
}