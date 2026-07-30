import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env variables for testing
config({ path: resolve(__dirname, '../.env') });
