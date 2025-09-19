'use server';

/**
 * @fileOverview Implements student identification by matching a face against enrolled students.
 *
 * - identifyStudent - A function that identifies a student from a photo.
 * - IdentifyStudentInput - The input type for the identifyStudent function.
 * - IdentifyStudentOutput - The return type for the identifyStudent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const StudentSchema = z.object({
  id: z.string().describe('The unique ID of the student.'),
  name: z.string().describe('The name of the student.'),
  avatar: z
    .string()
    .describe(
      "A photo of the student, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});

const IdentifyStudentInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a person to identify, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  students: z.array(StudentSchema).describe('A list of enrolled students to match against.'),
});
export type IdentifyStudentInput = z.infer<typeof IdentifyStudentInputSchema>;

const IdentifyStudentOutputSchema = z.object({
  studentId: z.string().nullable().describe('The ID of the matched student, or null if no confident match is found.'),
});
export type IdentifyStudentOutput = z.infer<typeof IdentifyStudentOutputSchema>;

export async function identifyStudent(input: IdentifyStudentInput): Promise<IdentifyStudentOutput> {
  return identifyStudentFlow(input);
}

const identifyStudentPrompt = ai.definePrompt({
  name: 'identifyStudentPrompt',
  input: {schema: IdentifyStudentInputSchema},
  output: {schema: IdentifyStudentOutputSchema},
  prompt: `You are an AI-powered student identification system. Your task is to accurately identify which student from the provided list appears in the input photo.

  **Instructions:**

  1.  **Analyze the Input Photo:** Carefully examine the facial features of the person in the input photo.
      Input Photo:
      {{media url=photoDataUri}}

  2.  **Compare with Enrolled Students:** One by one, compare the face from the input photo against the avatar of each student in the following list. Pay close attention to facial structure, eyes, nose, and mouth.
      Enrolled Students:
      {{#each students}}
      - Student ID: {{this.id}}, Name: {{this.name}}
        Avatar: {{media url=this.avatar}}
      {{/each}}

  3.  **Make a Confident Match:**
      - If you find a high-confidence match between the input photo and one of the student avatars, return the corresponding \`studentId\`.
      - If the person in the photo does not match any of the students, or if you are not highly confident in any match, you **must** return \`null\` for the \`studentId\`. Do not guess. Accuracy is critical.
  `,
});

const identifyStudentFlow = ai.defineFlow(
  {
    name: 'identifyStudentFlow',
    inputSchema: IdentifyStudentInputSchema,
    outputSchema: IdentifyStudentOutputSchema,
  },
  async input => {
    if (input.students.length === 0) {
      return { studentId: null };
    }
    const {output} = await identifyStudentPrompt(input);
    return output!;
  }
);
