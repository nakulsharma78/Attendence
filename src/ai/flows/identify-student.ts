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
  prompt: `You are an AI-powered student identification system. Your task is to identify which student from the provided list appears in the input photo.

  Compare the face in the input photo with the facial features in each of the student avatars provided in the 'students' array.

  Input Photo:
  {{media url=photoDataUri}}

  Enrolled Students:
  {{#each students}}
  - Student ID: {{this.id}}, Name: {{this.name}}
    Avatar: {{media url=this.avatar}}
  {{/each}}
  
  Based on your comparison, determine the ID of the student in the input photo. If you are confident in the match, provide the student's ID. If you are not confident, or if the person does not match any student, return null for the studentId.
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
