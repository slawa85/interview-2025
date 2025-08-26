### 1. Data Processing and Architecture Implemented:
**Frontend/Backend Separation Achieved:**
- **Backend (NestJS)**: Handles all data processing, ETL pipeline, and API endpoints
- **Frontend (React)**: Pure presentation layer consuming backend APIs
- **Database**: SQLite with TypeORM for structured vaccination storage
- **Environment Variables**: Secure configuration management across both layers

**Data Processing Pipeline:**
- Raw records fetched from Supabase on backend server-side
- Vaccination extraction performed using multilingual keywords ("vakcinace", "očkování", "vaccination", "rabies", "vzteklina")
- Processed data stored in local SQLite database with proper indexing
- Automated cron job pipeline runs every 6 hours using @nestjs/schedule

### 2. Latest Vaccination Identification:
**Implemented SQL-based solution:**
- Uses SQL window functions to identify latest vaccination per pet
- Query: `SELECT petId, MAX(visitDate) as maxVisitDate FROM vaccinations GROUP BY petId`
- More efficient than in-memory processing for large datasets
- Proper datetime handling with TypeORM

### 3. Libraries/Technologies Used:
**Backend Stack:**
- **NestJS**: Enterprise-grade Node.js framework for scalable APIs
- **TypeORM**: Object-Relational Mapping with SQLite database
- **@nestjs/schedule**: Automated cron job execution, to run the pipeline
- **dotenv**: Environment variable management

**Frontend Stack:**
- **React + TypeScript**: Type-safe component architecture
- **Custom API Service**: Abstracted backend communication

**Infrastructure:**
- **SQLite Database**: Local structured data storage with indexes
- **CORS Configuration**: Secure cross-origin communication
- **Standalone Cron Scripts**: Production-ready pipeline execution

### 4. Trade‑offs and what you would do next with more time
1. **Two-layer Architecture**: Full separation of concerns between frontend and backend
2. **Server-side Processing**: All ETL operations moved to backend for better performance
3. **Proper Data Storage**: Structured database with relationships and indexes
4. **API Endpoints**: RESTful API with proper HTTP status codes
5. **Environment Configuration**: Secure credential management
6. **Error Handling**: Comprehensive error handling with proper logging
7. **Loading States**: Frontend loading indicators and user feedback
8. **Type Safety**: Full TypeScript implementation across both layers
9. **Automated Pipeline**: Cron-based data processing with manual triggers

**API Endpoints Implemented:**
- `GET /vaccinations` - Latest vaccination per pet
- `GET /vaccinations/pet/:petId` - All vaccinations for specific pet
- `POST /pipeline/run` - Manual pipeline execution

### 5. Trade-offs and Technical Decisions:
- **Structured storage**: Data persisted in SQLite with proper schema
- **Performance optimized**: SQL queries with indexes for large datasets
- **Scalable architecture**: Separated concerns allow independent scaling

**Current Technical Choices:**
1. **SQLite over PostgreSQL**: Simpler deployment, suitable for current scale
2. **Manual cron vs. Queue System**: Direct implementation, could migrate to Bull/Redis later
3. **Basic string matching**: Effective for current medical terminology, extensible for NLP
4. **No authentication**: Current scope doesn't require it, easily addable

### 6. Next Phase Improvements:
**Performance & Scalability:**
1. **Database Migration**: PostgreSQL for production
2. **Caching Layer**: Redis for API response caching
3. **Queue System**: Bull/BullMQ for robust job processing
4. **Rate Limiting**: API throttling for production deployment

**Enhanced Features:**
1. **Advanced Text Processing**: Medical NLP for better vaccination detection
2. **Search & Filtering**: Date ranges, vaccination types, pet search
3. **Real-time Updates**: WebSocket connections for live data updates
5. **Audit Logging**: Track all data processing operations

**Production Readiness:**
1. **Testing**: Unit/integration tests for both frontend and backend
2. **Monitoring**: Health checks, metrics, alerting
4. **Deployment**: Docker containerization, CI/CD pipelines
5. **Security**: Authentication, authorization, input sanitization

You can access the service [here](https://interview-2025-1.onrender.com/)