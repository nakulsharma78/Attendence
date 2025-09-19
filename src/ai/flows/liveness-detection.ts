'use server';

/**
 * @fileOverview Implements liveness detection by analyzing facial movements.
 *
 * - detectLiveness - A function that determines if a detected face is a live person.
 * - LivenessDetectionInput - The input type for the detectLiveness function.
 * - LivenessDetectionOutput - The return type for the detectLiveness function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LivenessDetectionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a face, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type LivenessDetectionInput = z.infer<typeof LivenessDetectionInputSchema>;

const LivenessDetectionOutputSchema = z.object({
  isLive: z.boolean().describe('Whether the face is a live person.'),
  blinkDetected: z.boolean().describe('Whether a blink was detected.'),
  smileDetected: z.boolean().describe('Whether a smile was detected.'),
});
export type LivenessDetectionOutput = z.infer<typeof LivenessDetectionOutputSchema>;

export async function detectLiveness(input: LivenessDetectionInput): Promise<LivenessDetectionOutput> {
  return livenessDetectionFlow(input);
}

const livenessDetectionPrompt = ai.definePrompt({
  name: 'livenessDetectionPrompt',
  input: {schema: LivenessDetectionInputSchema},
  output: {schema: LivenessDetectionOutputSchema},
  prompt: `You are an AI-powered liveness detection system.  You will determine if the input photo contains a live person, and whether you can detect a blink or smile.

  Analyze the following face to detect liveness.  Consider the possibility of spoofing attempts, such as using a photo or video of a person.

  Photo: {{media url=photoDataUri}}
  `, 
});

const livenessDetectionFlow = ai.defineFlow(
  {
    name: 'livenessDetectionFlow',
    inputSchema: LivenessDetectionInputSchema,
    outputSchema: LivenessDetectionOutputSchema,
  },
  async input => {
    const {output} = await livenessDetectionPrompt(input);
    return output!;
  }
);
