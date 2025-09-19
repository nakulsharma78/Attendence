'use server';

import { z } from 'zod';

const contactSchema = z.object({
  name: z.string(),
  email: z.string().email(),
  institution: z.string(),
  message: z.string().optional(),
});

type ContactFormValues = z.infer<typeof contactSchema>;

type ActionState = {
  success: boolean;
  message: string;
};

export async function submitContactForm(data: ContactFormValues): Promise<ActionState> {
  const validation = contactSchema.safeParse(data);

  if (!validation.success) {
    return {
      success: false,
      message: 'Invalid form data. Please check your inputs.',
    };
  }

  // In a real application, you would integrate with an email service like SendGrid or Resend.
  // For this demo, we'll just log the data to the console.
  console.log('New Contact Form Submission:');
  console.log('Name:', data.name);
  console.log('Email:', data.email);
  console.log('Institution:', data.institution);
  console.log('Message:', data.message);

  // Simulate a network delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  return {
    success: true,
    message: 'Your message has been sent successfully!',
  };
}
