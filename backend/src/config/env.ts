import { config } from 'dotenv';
import { join } from 'path';

const result = config({ path: join(__dirname, '../../.env') });

if (result.error) {
  throw new Error('Failed to load environment variables');
}

export const env = {
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  OPENAI_ORG_ID: process.env.OPENAI_ORG_ID
};

if (!env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is required');
}