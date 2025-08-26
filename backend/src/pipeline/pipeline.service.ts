import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { createClient } from '@supabase/supabase-js';
import { VaccinationsService } from '../vaccinations/vaccinations.service';

@Injectable()
export class PipelineService {
  private readonly logger = new Logger(PipelineService.name);
  private readonly supabase;

  constructor(private readonly vaccinationsService: VaccinationsService) {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
  }

  @Cron(CronExpression.EVERY_6_HOURS)
  async runScheduledPipeline(): Promise<void> {
    this.logger.log('Running scheduled vaccination extraction pipeline...');
    await this.runPipeline(false);
  }

  async runPipeline(isManual: boolean = false): Promise<{
    success: boolean;
    message: string;
    results: {
      processed: number;
      extracted: number;
      saved: number;
      errors: number;
    };
  }> {
    const trigger = isManual ? 'manual trigger' : 'scheduled trigger';
    this.logger.log(`Starting vaccination extraction pipeline...`);

    try {
      // Fetch raw records from Supabase
      const { data: rawRecords, error } = await this.supabase
        .from('raw_records')
        .select('*')
        .order('visit_date', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch raw records: ${error.message}`);
      }

      this.logger.log(`Found ${rawRecords.length} raw records to process`);

      // Get already processed visit IDs
      const existingVaccinations = await this.vaccinationsService.getAllVaccinations();
      const processedVisitIds = new Set(existingVaccinations.map(v => v.visitId));

      let extracted = 0;
      let saved = 0;
      let errors = 0;

      for (const record of rawRecords) {
        if (processedVisitIds.has(record.visit_id)) {
          continue;
        }

        try {
          const vaccinations = this.extractVaccinationsFromRecord(record);
          
          if (vaccinations.length > 0) {
            extracted += vaccinations.length;
            
            for (const vaccination of vaccinations) {
              await this.vaccinationsService.saveVaccination(vaccination);
              saved++;
            }
          }
        } catch (error) {
          this.logger.error(`Error processing record ${record.visit_id}:`, error);
          errors++;
        }
      }

      if (saved === 0) {
        this.logger.log('No new vaccinations to save');
      }

      const results = {
        processed: rawRecords.length,
        extracted,
        saved,
        errors
      };

      this.logger.log(`Pipeline completed! Processed: ${results.processed}, Extracted: ${results.extracted}, Saved: ${results.saved}, Errors: ${results.errors}`);

      return {
        success: true,
        message: `Pipeline completed successfully (${trigger})`,
        results
      };

    } catch (error) {
      this.logger.error('Pipeline failed:', error);
      return {
        success: false,
        message: `Pipeline failed: ${error.message}`,
        results: {
          processed: 0,
          extracted: 0,
          saved: 0,
          errors: 1
        }
      };
    }
  }

  private extractVaccinationsFromRecord(rawRecord: any): Array<{
    petId: number;
    visitId: number;
    visitDate: string;
    vaccinationType: string;
    rawRecordId: number;
    extractedText: string;
  }> {
    const report = rawRecord.raw_record?.report || '';
    const reportLower = report.toLowerCase();

    const vaccinationKeywords = [
      'vakcinace', 'vaccination', 'očkování', 'očkovan', 'vakcinovan', 'ockovan'
    ];

    const hasVaccination = vaccinationKeywords.some(keyword => 
      reportLower.includes(keyword)
    );

    if (!hasVaccination) {
      return [];
    }

    const vaccinationType = this.extractVaccinationType(report);

    return [{
      petId: rawRecord.pet_id,
      visitId: rawRecord.visit_id,
      visitDate: rawRecord.visit_date,
      vaccinationType,
      rawRecordId: rawRecord.visit_id,
      extractedText: report
    }];
  }

  private extractVaccinationType(report: string): string {
    const reportLower = report.toLowerCase();

    if (reportLower.includes('vzteklina') || reportLower.includes('rabies')) {
      return 'Rabies';
    }
    if (reportLower.includes('kombinovaná') || reportLower.includes('combined')) {
      return 'Combined vaccination';
    }
    if (reportLower.includes('vakcinace')) {
      return 'Standard vaccination';
    }
    if (reportLower.includes('očkování') || 
        reportLower.includes('ockovani') || 
        reportLower.includes('očkovan') || 
        reportLower.includes('ockovan') || 
        reportLower.includes('vakcinovan') ||
        reportLower.includes('vaccination')) {
      return 'Vaccination';
    }

    return 'Unknown vaccination type';
  }
}