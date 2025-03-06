import OpenAI from 'openai';
import { env } from './env';

if (!env.OPENAI_API_KEY) {
  throw new Error('OpenAI API key is required');
}

export const openai = new OpenAI({
  apiKey: env.OPENAI_API_KEY,
  organization: env.OPENAI_ORG_ID // optional
});