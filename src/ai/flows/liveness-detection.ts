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
  isLive: z.boolean().describe('Whether the face is a live person and not a static image or video.'),
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
  prompt: `You are an advanced AI-powered liveness detection system. Your task is to determine if the input photo contains a real, live person in that moment, and not a static photo, screen, or other spoofing attempt.

  **Instructions:**

  1.  **Analyze the Image for Liveness Cues:** Examine the following image for subtle signs of life. Look for natural imperfections, lighting and shadows that suggest a 3D presence, eye reflections, and micro-expressions.
      Photo: {{media url=photoDataUri}}

  2.  **Detect Specific Actions:**
      - Analyze the eyes. Is there evidence of a blink (e.g., partially closed eyelids, motion blur)? Set \`blinkDetected\` accordingly.
      - Analyze the mouth and facial muscles. Is there evidence of a smile? Set \`smileDetected\` accordingly.

  3.  **Determine Overall Liveness:** Based on your analysis, make a final judgment.
      - If you detect signs of a real person (e.g., natural expression, 3D depth, detected actions), set \`isLive\` to \`true\`.
      - If the image appears to be a photo of a photo, a face on a screen, or otherwise looks static or fake, set \`isLive\` to \`false\`.
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
