'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Loader, UserPlus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addStudent } from '@/lib/db';
import Image from 'next/image';
import placeholderImages from '@/lib/placeholder-images.json';

const enrollmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  studentId: z.string().min(4, 'Student ID must be at least 4 characters'),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

export function EnrollmentClient() {
  const [isCapturing, setIsCapturing] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState(placeholderImages.placeholderImages[5].imageUrl);
  const { toast } = useToast();

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { name: '', studentId: '' },
  });

  const onSubmit = (data: EnrollmentFormValues) => {
    setIsCapturing(true);

    setTimeout(() => {
      const newStudent = {
        id: data.studentId,
        name: data.name,
        avatar: capturedImage,
      };

      try {
        addStudent(newStudent);
        toast({
          title: 'Enrollment Successful',
          description: `${data.name} has been enrolled.`,
        });
        form.reset();
        // pick a new random image for next enrollment
        const randomIndex = Math.floor(Math.random() * placeholderImages.placeholderImages.length);
        setCapturedImage(placeholderImages.placeholderImages[randomIndex].imageUrl);
      } catch (error) {
        toast({
          title: 'Enrollment Failed',
          description: (error as Error).message,
          variant: 'destructive',
        });
      } finally {
        setIsCapturing(false);
      }
    }, 1500);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <Card>
        <CardHeader>
          <CardTitle>New Student Details</CardTitle>
          <CardDescription>Enter the student's information below to begin enrollment.</CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., John Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="studentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Student ID</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., 123456" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isCapturing} className="w-full">
                {isCapturing ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
                Enroll Student
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
      <div className="flex flex-col items-center justify-center">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Facial Capture</CardTitle>
            <CardDescription>A facial scan is required for biometric identification.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-dashed border-primary/50 flex items-center justify-center bg-muted">
              {isCapturing && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                  <Loader className="h-12 w-12 text-white animate-spin" />
                  <p className="text-white mt-2">Capturing Biometrics...</p>
                </div>
              )}
              <Image 
                src={capturedImage}
                alt="Facial capture preview"
                width={400}
                height={400}
                className="object-cover w-full h-full"
                data-ai-hint="student portrait"
                />
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="outline" className="w-full" onClick={() => {
                const randomIndex = Math.floor(Math.random() * placeholderImages.placeholderImages.length);
                setCapturedImage(placeholderImages.placeholderImages[randomIndex].imageUrl);
            }}>
              <Camera className="mr-2 h-4 w-4" />
              Retake Photo
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
