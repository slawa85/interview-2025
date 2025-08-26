#!/usr/bin/env node

/**
 * Standalone cron script for running the vaccination extraction pipeline
 * 
 * Usage:
 * 1. Add to crontab: 0 *\/6 * * * node /path/to/run-pipeline-cron.js
 * 2. Or run manually: node run-pipeline-cron.js
 * 
 * This script can run independently of the NestJS server
 */

const { createClient } = require('@supabase/supabase-js');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

class StandalonePipeline {
  constructor() {
    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error('SUPABASE_URL and SUPABASE_ANON_KEY environment variables are required');
    }
    
    this.supabase = createClient(supabaseUrl, supabaseAnonKey);
    
    this.dbPath = path.join(__dirname, '..', process.env.DATABASE_PATH || 'vaccinations.db');
    console.log(`Using database: ${this.dbPath}`);
  }

  async run() {
    console.log(`${new Date().toISOString()} - Starting vaccination pipeline cron job`);
    
    try {
      const db = new sqlite3.Database(this.dbPath);
      
      const { data: rawRecords, error } = await this.supabase
        .from('raw_records')
        .select('*')
        .order('visit_date', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch raw records: ${error.message}`);
      }

      console.log(`Found ${rawRecords.length} raw records to process`);

      const processedIds = await this.getProcessedVisitIds(db);
      console.log(`Found ${processedIds.size} already processed records`);

      const newVaccinations = [];
      let errors = 0;

      for (const record of rawRecords) {
        if (processedIds.has(record.visit_id)) {
          continue;
        }

        try {
          const vaccinations = this.extractVaccinationsFromRecord(record);
          newVaccinations.push(...vaccinations);
        } catch (error) {
          console.error(`Error processing record ${record.visit_id}:`, error);
          errors++;
        }
      }

      if (newVaccinations.length > 0) {
        await this.insertVaccinations(db, newVaccinations);
        console.log(`Inserted ${newVaccinations.length} new vaccination records`);
      } else {
        console.log('No new vaccinations to process');
      }

      db.close();

      const summary = {
        timestamp: new Date().toISOString(),
        totalRawRecords: rawRecords.length,
        alreadyProcessed: processedIds.size,
        newVaccinations: newVaccinations.length,
        errors
      };

      console.log(`Pipeline completed successfully:`, summary);
    } catch (error) {
      console.error('Pipeline failed:', error);
      process.exit(1);
    }
  }

  getProcessedVisitIds(db) {
    return new Promise((resolve, reject) => {
      db.all('SELECT DISTINCT visitId FROM vaccinations', [], (err, rows) => {
        if (err) {
          reject(err);
        } else {
          const visitIds = new Set(rows.map(row => row.visitId));
          resolve(visitIds);
        }
      });
    });
  }

  extractVaccinationsFromRecord(rawRecord) {
    const report = rawRecord.raw_record?.report || '';
    const reportLower = report.toLowerCase();

    const vaccinationKeywords = [
      'vakcinace', 'vaccination', 'očkování', 'očkovan', 'vakcinovan'
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

  extractVaccinationType(report) {
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
    if (reportLower.includes('očkování')) {
      return 'Vaccination';
    }
    if (reportLower.includes('vaccination')) {
      return 'Vaccination';
    }

    return 'Unknown vaccination type';
  }

  insertVaccinations(db, vaccinations) {
    return new Promise((resolve, reject) => {
      const stmt = db.prepare(`
        INSERT INTO vaccinations (petId, visitId, visitDate, vaccinationType, rawRecordId, extractedText, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);

      const now = new Date().toISOString();
      
      for (const vaccination of vaccinations) {
        stmt.run([
          vaccination.petId,
          vaccination.visitId,
          vaccination.visitDate,
          vaccination.vaccinationType,
          vaccination.rawRecordId,
          vaccination.extractedText,
          now,
          now
        ], (err) => {
          if (err) {
            console.error('Error inserting vaccination:', err);
          }
        });
      }

      stmt.finalize((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

// Run the pipeline
if (require.main === module) {
  const pipeline = new StandalonePipeline();
  pipeline.run().catch(error => {
    console.error('Cron job failed:', error);
    process.exit(1);
  });
}

module.exports = { StandalonePipeline };