'use server';
/**
 * @fileOverview Implements real-time verification prompts for attendance system.
 *
 * - generateVerificationPrompt - A function to generate a random verification prompt.
 * - VerificationPromptOutput - The output type for the generateVerificationPrompt function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const VerificationPromptOutputSchema = z.object({
  prompt: z.string().describe('A random verification prompt for the student.'),
});
export type VerificationPromptOutput = z.infer<typeof VerificationPromptOutputSchema>;

export async function generateVerificationPrompt(): Promise<VerificationPromptOutput> {
  return generateVerificationPromptFlow();
}

const prompt = ai.definePrompt({
  name: 'verificationPrompt',
  prompt: `You are an attendance verification assistant. Generate a random, short, and simple instruction for a student to perform to prove their live presence during attendance.

  Examples:
  * Blink twice.
  * Smile briefly.
  * Nod your head slightly.
  * Look to your left, then to your right.

  The prompt should be very short.  Do not include any introductory or concluding remarks. Do not start with "Please". Just give the instruction. Do not mention that it is a verification step.
  `,
  output: {schema: VerificationPromptOutputSchema},
});

const generateVerificationPromptFlow = ai.defineFlow({
  name: 'generateVerificationPromptFlow',
  outputSchema: VerificationPromptOutputSchema,
},
async () => {
  const {output} = await prompt({});
  return output!;
});
