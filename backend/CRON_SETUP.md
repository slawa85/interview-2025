# Vaccination Pipeline Cron Job Setup

The vaccination data extraction pipeline now runs automatically via cron jobs instead of manual API calls.

## 🔄 Automatic Cron Jobs (NestJS)

When the NestJS server starts, it automatically schedules the pipeline to run every 6 hours:

```typescript
@Cron(CronExpression.EVERY_6_HOURS)
async runScheduledPipeline(): Promise<void>
```

### Available Cron Expressions:
- `CronExpression.EVERY_HOUR` - Every hour
- `CronExpression.EVERY_6_HOURS` - Every 6 hours (current setting)
- `CronExpression.EVERY_12_HOURS` - Every 12 hours  
- `CronExpression.EVERY_DAY_AT_MIDNIGHT` - Daily at midnight
- `CronExpression.EVERY_30_MINUTES` - Every 30 minutes

### Logs
The scheduled pipeline logs will appear in the NestJS console:
```
⏰ Scheduled pipeline execution started
✅ Scheduled pipeline completed successfully: {"processed":600,"extracted":0,"saved":0,"errors":0}
```

## 🐧 Standalone Cron Job (Production)

For production environments where you want the pipeline to run independently of the web server:

### 1. Add to System Crontab

```bash
# Run every 6 hours
0 */6 * * * node /path/to/backend/scripts/run-pipeline-cron.js

# Or every hour
0 * * * * node /path/to/backend/scripts/run-pipeline-cron.js

# Or daily at 2 AM
0 2 * * * node /path/to/backend/scripts/run-pipeline-cron.js
```

### 2. Manual Execution

```bash
cd backend/scripts
node run-pipeline-cron.js
```

### 3. Monitoring Logs

The standalone script writes logs to:
```
backend/logs/pipeline-runs.log
```

Each line contains a JSON summary:
```json
{"timestamp":"2025-08-26T13:45:00.000Z","totalRawRecords":600,"alreadyProcessed":115,"newVaccinations":0,"errors":0}
```

## ⚙️ Configuration Options

### Change Schedule Frequency

Edit `backend/src/pipeline/pipeline.service.ts`:

```typescript
// For testing - every 5 minutes
@Cron('*/5 * * * *')

// Production - daily at 3 AM
@Cron('0 3 * * *')

// Custom - every Tuesday at 2:30 AM
@Cron('30 2 * * 2')
```

### Environment Variables

Set these environment variables for production:

```bash
# Optional: Custom database path
VACCINATION_DB_PATH=/path/to/vaccinations.db

# Optional: Custom log directory
PIPELINE_LOG_DIR=/var/log/vaccination-pipeline/
```

## 📊 Monitoring

### Check Pipeline Status

The pipeline processes only new records, so subsequent runs will show:
- `newVaccinations: 0` (if no new data)
- `alreadyProcessed: 115` (existing records)

### Pipeline Health Checks

1. **NestJS Health**: Pipeline runs automatically when server is running
2. **Standalone Health**: Check log files for recent successful runs
3. **Database Health**: Verify new records are being inserted

### Troubleshooting

**Pipeline not running?**
- Check NestJS server logs for cron execution
- Verify ScheduleModule is imported in AppModule
- Check standalone script has database access

**No new data extracted?**  
- Normal behavior when no new raw records in Supabase
- Pipeline only processes unprocessed visit IDs

**Performance issues?**
- Consider reducing frequency (every 12/24 hours)  
- Monitor database size and query performance
- Add indexes if processing large datasets

## 🚀 Benefits of Cron-Based Pipeline

1. **Automated**: No manual intervention required
2. **Reliable**: Runs even if web requests aren't happening
3. **Efficient**: Only processes new data
4. **Scalable**: Can run independently of web server
5. **Monitorable**: Detailed logging and error handling
6. **Production-Ready**: Suitable for deployment environments