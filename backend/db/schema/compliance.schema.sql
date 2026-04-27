-- Core compliance tables
CREATE TABLE IF NOT EXISTS suppliers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  country TEXT,
  tier TEXT
);
