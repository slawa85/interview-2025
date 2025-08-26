1. Assumptions about data shape and edge cases:
Data structure, I assumed raw_records table contains a JSON field with nested report text containing vaccination information
Language support, handled multilingual vaccination keywords "vakcinace", "očkování", "vaccination", applied case-insensitive filtering using .toLowerCase()
Edge cases that I handled:
    1. Missing or null raw_record.report fields (defaulted to empty string)
    2. Records without vaccination mentions are filtered out
    3. Multiple vaccinations per pet are supported
    4. Pets with no vaccinations display "No vaccinations found"

2. How you identified "latest vaccination":
I'm using a Map data structure to track the most recent vaccination per pet, converting the date string to Date object, this will allow me a better chronological accuracy, and for each pet, kept only the vaccination record with the latest visit_date.

3. Libraries/services used and why:
Supabase: for database connectivity - provides PostgreSQL access also supports real-time capabilities
React + TypeScript: chosen for type safety and component-based architecture
I'm not using some specific processing libraries, just implemented custom filtering and sorting logic to keep dependencies minimal, also built-in Date constructor for date
parsing and comparison

4. Trade-offs and what you would do next with more time:
Among the most important trade-offs I did :
  1. Simple string matching - I used basic .includes() for vaccination detection - here is some room for improvments, I could miss variations
  2. No caching - data are fetched on every app load
  3. Basic error handling - only simple try/catch without detailed error categorization
  4. In-memory processing - all the records are processed client-side

Where I would spend more time:
  1. First of all I would go with two different layers, FE and BE, this will allow me a better scallability, performance and controll 
  1. Better text parsing - here is some room for improvments, NLP or regex patterns for more accurate vaccination detection
  2. Caching strategy - local storage or storing on the backend side (database) and add some intermediary caching mechanism (Redis, Memcached)
  3. Pagination: For large datasets
  4. Error boundaries: Better error handling and user feedback
  5. Increased test coverage
  6. Some filters like, date range filters, vaccination type filters
  7. Some loading indicators, will enchance the user experience
  8. Maybe some raw_data schema validation.
  