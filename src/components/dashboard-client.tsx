'use client';

import * as React from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Loader,
  ScanFace,
  ShieldAlert,
  ShieldCheck,
  User,
  Camera,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { generateVerificationPrompt, detectLiveness } from '@/lib/actions';
import type { Student, AttendanceRecord, AttendanceStatus, VerificationStatus } from '@/types';
import { getStudents, addAttendanceRecord, getAttendanceRecords } from '@/lib/db';
import Image from 'next/image';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

type StudentWithStatus = Student & {
  attendanceStatus: AttendanceStatus;
  verificationStatus: VerificationStatus;
};

type VerificationState = {
  student: StudentWithStatus | null;
  prompt: string;
  isVerifying: boolean;
};

const STATUS_CONFIG = {
  Unmarked: { icon: User, color: 'text-muted-foreground', label: 'Unmarked' },
  Scanning: { icon: Loader, color: 'text-blue-500 animate-spin', label: 'Scanning...' },
  Present: { icon: CheckCircle, color: 'text-green-500', label: 'Present' },
  Verification: { icon: ShieldAlert, color: 'text-accent', label: 'Verification Required' },
  Verified: { icon: ShieldCheck, color: 'text-green-600', label: 'Verified' },
  Failed: { icon: AlertTriangle, color: 'text-destructive', label: 'Verification Failed' },
};

function StudentStatusIcon({ student }: { student: StudentWithStatus }) {
  const status = student.verificationStatus !== 'Not Required' && student.verificationStatus !== 'Pending' ? student.verificationStatus : student.attendanceStatus;
  
  const config = STATUS_CONFIG[status === 'Present' && student.verificationStatus === 'Pending' ? 'Verification' : status] || STATUS_CONFIG.Unmarked;
  
  const Icon = config.icon;
  return (
    <div className="flex items-center gap-2">
      <Icon className={`h-4 w-4 ${config.color}`} />
      <span className="text-xs font-medium">{config.label}</span>
    </div>
  );
}

export function DashboardClient() {
  const [students, setStudents] = React.useState<StudentWithStatus[]>([]);
  const [isScanning, setIsScanning] = React.useState(false);
  const [scanProgress, setScanProgress] = React.useState(0);
  const [verificationState, setVerificationState] = React.useState<VerificationState>({ student: null, prompt: '', isVerifying: false });
  const { toast } = useToast();
  const videoRef = React.useRef<HTMLVideoElement>(null);
  const [hasCameraPermission, setHasCameraPermission] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    const allStudents = getStudents();
    setStudents(
      allStudents.map((s) => ({
        ...s,
        attendanceStatus: 'Unmarked',
        verificationStatus: 'Not Required',
      }))
    );
  }, []);

  React.useEffect(() => {
    if (verificationState.student) {
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
    } else {
      // Turn off camera when dialog closes
      if (videoRef.current && videoRef.current.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      setHasCameraPermission(null);
    }
  }, [verificationState.student, toast]);


  const resetState = () => {
    setIsScanning(false);
    setScanProgress(0);
    const allStudents = getStudents();
    setStudents(
      allStudents.map((s) => ({
        ...s,
        attendanceStatus: 'Unmarked',
        verificationStatus: 'Not Required',
      }))
    );
  };
  
  const startAttendance = async () => {
    setIsScanning(true);
    const totalStudents = students.length;

    for (let i = 0; i < totalStudents; i++) {
      const currentStudent = students[i];
      
      // Mark as scanning
      setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, attendanceStatus: 'Scanning' } : s));
      await new Promise(res => setTimeout(res, 1000));

      // Mark as present
      setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, attendanceStatus: 'Present' } : s));
      
      const shouldVerify = Math.random() > 0.6; // 40% chance to verify
      if (shouldVerify) {
        setStudents(prev => prev.map(s => s.id === currentStudent.id ? { ...s, verificationStatus: 'Pending' } : s));
        const { prompt } = await generateVerificationPrompt();
        
        // This is a bit tricky, we need to update state and then wait.
        // A dedicated state management would be better, but for this component, we can do this.
        await new Promise<void>(resolve => {
          setVerificationState({ student: {...currentStudent, attendanceStatus: 'Present', verificationStatus: 'Pending'}, prompt, isVerifying: false });

          const interval = setInterval(() => {
            setVerificationState(current => {
              if (current.student === null) {
                clearInterval(interval);
                resolve();
              }
              return current;
            })
          }, 100);
        });

      } else {
        const record: Omit<AttendanceRecord, 'id'> = {
          studentId: currentStudent.id,
          studentName: currentStudent.name,
          date: new Date().toISOString().split('T')[0],
          status: 'Present',
          verification: 'Not Required'
        };
        addAttendanceRecord(record);
      }

      setScanProgress(((i + 1) / totalStudents) * 100);
      await new Promise(res => setTimeout(res, 500));
    }

    toast({ title: "Attendance Complete", description: "All students have been processed." });
    setIsScanning(false);
  };
  
  const handleVerification = async () => {
    if (!verificationState.student || !videoRef.current) return;
    setVerificationState(prev => ({ ...prev, isVerifying: true }));
    
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    const context = canvas.getContext('2d');
    if (context) {
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const photoDataUri = canvas.toDataURL('image/jpeg');

      const result = await detectLiveness({ photoDataUri });
      
      const isLive = result.isLive;
      const finalVerificationStatus: VerificationStatus = isLive ? 'Verified' : 'Failed';
      
      setStudents(prev => prev.map(s => s.id === verificationState.student!.id ? { ...s, verificationStatus: finalVerificationStatus } : s));
      
      const record: Omit<AttendanceRecord, 'id'> = {
        studentId: verificationState.student.id,
        studentName: verificationState.student.name,
        date: new Date().toISOString().split('T')[0],
        status: 'Present',
        verification: finalVerificationStatus
      };
      addAttendanceRecord(record);
      
      toast({
        title: isLive ? "Verification Successful" : "Verification Failed",
        description: isLive ? `${verificationState.student.name} has been verified.` : `Liveness check failed for ${verificationState.student.name}.`,
        variant: isLive ? 'default' : 'destructive'
      });
    } else {
       toast({
        title: "Verification Error",
        description: "Could not capture image from video.",
        variant: 'destructive'
      });
    }
    
    setVerificationState({ student: null, prompt: '', isVerifying: false });
  };


  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Live Attendance Feed</h2>
          <Button onClick={isScanning ? resetState : startAttendance} disabled={isScanning && scanProgress < 100}>
            {isScanning ? (scanProgress < 100 ? 'Stop Scanning' : 'Reset') : <><ScanFace className="mr-2 h-4 w-4" /> Start Attendance</>}
          </Button>
        </div>
        {isScanning && (
          <div className="mt-4">
            <Progress value={scanProgress} className="w-full" />
            <p className="text-sm text-muted-foreground mt-2 text-center">Scanning student {Math.min(students.length, Math.floor(scanProgress / (100/students.length)) + 1)} of {students.length}...</p>
          </div>
        )}
      </div>

      <div className="flex-grow overflow-y-auto p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {students.map((student) => (
            <Card key={student.id} className="overflow-hidden transition-all hover:shadow-lg">
              <CardHeader className="p-0 relative">
                <Image
                  src={student.avatar}
                  alt={student.name}
                  width={200}
                  height={200}
                  className="w-full h-auto aspect-square object-cover"
                  data-ai-hint="student portrait"
                />
              </CardHeader>
              <CardContent className="p-3">
                <p className="font-semibold truncate">{student.name}</p>
                <div className="mt-2">
                  <StudentStatusIcon student={student} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Dialog open={!!verificationState.student} onOpenChange={(isOpen) => !isOpen && setVerificationState({ student: null, prompt: '', isVerifying: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liveness Verification for {verificationState.student?.name}</DialogTitle>
            <DialogDescription>
              Please ask the student to perform the following action to verify their presence.
            </DialogDescription>
          </DialogHeader>
          <div className="my-6 text-center">
            <div className="relative aspect-video w-full rounded-lg overflow-hidden border-2 border-dashed border-primary/50 flex items-center justify-center bg-muted mb-4">
              <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              {hasCameraPermission === false && (
                <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center text-white p-4">
                  <Camera className="h-12 w-12 text-destructive mb-2" />
                  <p className="font-semibold">Camera Access Denied</p>
                  <p className="text-sm text-center">Please enable camera permissions to continue.</p>
                </div>
              )}
               {hasCameraPermission === null && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
              )}
            </div>
            <p className="text-2xl font-bold text-primary">{verificationState.prompt}</p>
          </div>
          <Button onClick={handleVerification} disabled={verificationState.isVerifying || hasCameraPermission !== true} className="w-full">
            {verificationState.isVerifying ? <Loader className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
            Confirm Liveness
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
