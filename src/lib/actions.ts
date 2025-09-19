'use server';

import { generateVerificationPrompt as genPrompt } from '@/ai/flows/real-time-verification-prompts';
import { detectLiveness as detectLive, LivenessDetectionInput } from '@/ai/flows/liveness-detection';

export async function generateVerificationPrompt() {
  return await genPrompt();
}

export async function detectLiveness(input: LivenessDetectionInput) {
  // In a real-world high-security scenario, you might add more checks here.
  // The AI flow itself is designed to be robust.
  const result = await detectLive(input);
  return result;
}
