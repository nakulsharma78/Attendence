'use server';

import { generateVerificationPrompt as genPrompt } from '@/ai/flows/real-time-verification-prompts';
import { detectLiveness as detectLive, LivenessDetectionInput } from '@/ai/flows/liveness-detection';
import { identifyStudent as identify, IdentifyStudentInput } from '@/ai/flows/identify-student';


export async function generateVerificationPrompt() {
  return await genPrompt();
}

export async function detectLiveness(input: LivenessDetectionInput) {
  const result = await detectLive(input);
  return result;
}

export async function identifyStudent(input: IdentifyStudentInput) {
  const result = await identify(input);
  return result;
}
