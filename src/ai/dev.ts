import { config } from 'dotenv';
config();

import '@/ai/flows/real-time-verification-prompts.ts';
import '@/ai/flows/liveness-detection.ts';
import '@/ai/flows/identify-student.ts';
