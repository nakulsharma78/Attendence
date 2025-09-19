'use client';

import * as React from 'react';
import { Camera, Loader, ScanFace, ShieldCheck, UserCheck, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { identifyStudent, detectLiveness } from '@/lib/actions';
import type { Student, AttendanceRecord, VerificationStatus } from '@/types';
import { getStudents, addAttendanceRecord, getAttendanceRecords } from '@/lib/db';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type IdentificationState = 'Idle' | 'Identifying' | 'Verifying' | 'Success' | 'Failure' | 'Error';

type IdentificationResult = {
  student: Student | null;
  message: string;
}

export function DashboardClient() {
  const [students, setStudents] = React.useState<Student[]>([]);
  const [state, setState] = React.useState<IdentificationState>('Idle');
  const [result, setResult] = React.useState<IdentificationResult | null>(null);
  const { toast } = useToast();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    setStudents(getStudents());
    
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
      // Turn off camera when component unmounts
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
      }
    };
  }, [toast]);

  const handleMarkAttendance = async () => {
    if (!videoRef.current) return;
    setState('Identifying');
    setResult(null);

    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');

    if (!context) {
      setState('Error');
      setResult({ student: null, message: "Could not get canvas context." });
      return;
    }
    
    context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
    const photoDataUri = canvas.toDataURL('image/jpeg');

    try {
      // 1. Identify Student
      const { studentId } = await identifyStudent({ photoDataUri, students });

      if (!studentId) {
        setState('Failure');
        setResult({ student: null, message: 'No student recognized. Please try again.' });
        return;
      }

      const student = students.find(s => s.id === studentId);
      if (!student) {
        setState('Failure');
        setResult({ student: null, message: `Student ID ${studentId} found but not in local list.` });
        return;
      }

      setResult({ student, message: `Identified ${student.name}. Now verifying liveness...` });
      setState('Verifying');
      
      // 2. Detect Liveness
      const livenessResult = await detectLiveness({ photoDataUri });

      if (!livenessResult.isLive) {
        setState('Failure');
        setResult({ student, message: `Liveness check failed for ${student.name}. Please ensure you are in a well-lit room and perform a clear action if prompted.` });
        return;
      }

      // 3. Mark Attendance
      const record: Omit<AttendanceRecord, 'id'> = {
        studentId: student.id,
        studentName: student.name,
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        verification: 'Verified',
      };
      addAttendanceRecord(record);

      setState('Success');
      setResult({ student, message: `Welcome, ${student.name}! Your attendance has been marked.` });
      
      toast({
        title: "Attendance Marked",
        description: `${student.name} marked as present.`,
      });

      // Reset after a few seconds
      setTimeout(() => {
        setState('Idle');
        setResult(null);
      }, 5000);

    } catch (error) {
      console.error(error);
      setState('Error');
      setResult({ student: null, message: 'An unexpected error occurred during identification.' });
      toast({
        title: "Identification Error",
        description: "Could not process image.",
        variant: 'destructive'
      });
    }
  };
  
  const isProcessing = state === 'Identifying' || state === 'Verifying';

  const getStatusContent = () => {
    switch(state) {
      case 'Identifying':
        return { icon: <Loader className="animate-spin h-8 w-8 text-primary" />, message: 'Identifying student...' };
      case 'Verifying':
        return { icon: <Loader className="animate-spin h-8 w-8 text-accent" />, message: result?.message || 'Verifying liveness...' };
      case 'Success':
        return { icon: <UserCheck className="h-8 w-8 text-green-500" />, message: result?.message || 'Success!' };
      case 'Failure':
        return { icon: <AlertTriangle className="h-8 w-8 text-destructive" />, message: result?.message || 'Verification failed.' };
      case 'Error':
        return { icon: <AlertTriangle className="h-8 w-8 text-destructive" />, message: result?.message || 'An error occurred.' };
      case 'Idle':
      default:
        return { icon: <ScanFace className="h-8 w-8 text-muted-foreground" />, message: 'Position your face in the camera frame and click "Mark Attendance"' };
    }
  }

  const { icon, message } = getStatusContent();

  return (
    <div className="flex justify-center items-center h-full p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Attendance Station</CardTitle>
          <CardDescription>
            {students.length === 0 
              ? "No students enrolled. Please enroll students first."
              : "Students can mark their attendance here."
            }
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-4">
          <div className="relative aspect-square w-full rounded-lg overflow-hidden border-2 border-dashed border-primary/50 flex items-center justify-center bg-muted">
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
          </div>

          <div className="text-center p-4 border rounded-lg w-full min-h-[80px] flex flex-col items-center justify-center">
            <div className="mb-2">{icon}</div>
            <p className="text-sm font-medium">{message}</p>
          </div>

          <Button 
            onClick={handleMarkAttendance} 
            disabled={isProcessing || hasCameraPermission !== true || students.length === 0} 
            className="w-full"
            size="lg"
          >
            {isProcessing ? <Loader className="animate-spin" /> : <Camera className="mr-2" />}
            Mark My Attendance
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
