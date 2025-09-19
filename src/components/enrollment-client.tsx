'use client';

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Camera, Loader, UserPlus, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { addStudent } from '@/lib/db';
import Image from 'next/image';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const enrollmentSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  studentId: z.string().min(4, 'Student ID must be at least 4 characters'),
});

type EnrollmentFormValues = z.infer<typeof enrollmentSchema>;

export function EnrollmentClient() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [capturedImage, setCapturedImage] = React.useState<string | null>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const { toast } = useToast();

  const form = useForm<EnrollmentFormValues>({
    resolver: zodResolver(enrollmentSchema),
    defaultValues: { name: '', studentId: '' },
  });

  React.useEffect(() => {
    const getCameraPermission = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        setHasCameraPermission(true);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (error) {
        console.error('Error accessing camera:', error);
        setHasCameraPermission(false);
        toast({
          variant: 'destructive',
          title: 'Camera Access Denied',
          description: 'Please enable camera permissions in your browser settings to use this app.',
        });
      }
    };

    getCameraPermission();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    }
  }, [toast]);

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        setCapturedImage(canvas.toDataURL('image/jpeg'));
      }
    }
  };

  const retakePhoto = () => {
    setCapturedImage(null);
  };


  const onSubmit = (data: EnrollmentFormValues) => {
    if (!capturedImage) {
      toast({
        title: 'No Photo Captured',
        description: 'Please capture a photo before enrolling.',
        variant: 'destructive',
      });
      return;
    }
    setIsSubmitting(true);

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
        setCapturedImage(null);
      } catch (error) {
        toast({
          title: 'Enrollment Failed',
          description: (error as Error).message,
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
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
              <Button type="submit" disabled={isSubmitting || !capturedImage} className="w-full">
                {isSubmitting ? <Loader className="mr-2 h-4 w-4 animate-spin" /> : <UserPlus className="mr-2 h-4 w-4" />}
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
              {isSubmitting && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center z-10">
                  <Loader className="h-12 w-12 text-white animate-spin" />
                  <p className="text-white mt-2">Enrolling Student...</p>
                </div>
              )}
              
              {capturedImage ? (
                <Image 
                  src={capturedImage}
                  alt="Facial capture preview"
                  width={400}
                  height={400}
                  className="object-cover w-full h-full"
                  data-ai-hint="student portrait"
                />
              ) : (
                <>
                  <video ref={videoRef} className="object-cover w-full h-full" autoPlay muted playsInline />
                  {hasCameraPermission === false && (
                    <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-4 z-10">
                       <Alert variant="destructive">
                        <AlertTitle>Camera Access Required</AlertTitle>
                        <AlertDescription>
                          Please allow camera access to use this feature.
                        </AlertDescription>
                      </Alert>
                    </div>
                  )}
                   {hasCameraPermission === null && (
                    <div className="absolute inset-0 flex items-center justify-center z-10">
                      <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                    </div>
                  )}
                </>
              )}
            </div>
          </CardContent>
          <CardFooter>
            {capturedImage ? (
               <Button variant="outline" className="w-full" onClick={retakePhoto}>
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retake Photo
              </Button>
            ) : (
              <Button variant="outline" className="w-full" onClick={capturePhoto} disabled={hasCameraPermission !== true}>
                <Camera className="mr-2 h-4 w-4" />
                Capture Photo
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
