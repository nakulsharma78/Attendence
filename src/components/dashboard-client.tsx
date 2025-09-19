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
      const student = students[i];
      
      // Mark as scanning
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, attendanceStatus: 'Scanning' } : s));
      await new Promise(res => setTimeout(res, 1000));

      // Mark as present
      setStudents(prev => prev.map(s => s.id === student.id ? { ...s, attendanceStatus: 'Present' } : s));
      
      const shouldVerify = Math.random() > 0.6; // 40% chance to verify
      if (shouldVerify) {
        setStudents(prev => prev.map(s => s.id === student.id ? { ...s, verificationStatus: 'Pending' } : s));
        const { prompt } = await generateVerificationPrompt();
        setVerificationState({ student: students[i], prompt, isVerifying: false });
        // Wait for verification dialog to close
        await new Promise<void>(resolve => {
          const interval = setInterval(() => {
            if (verificationState.student === null) {
              clearInterval(interval);
              resolve();
            }
          }, 100);
        });
      } else {
        const record: Omit<AttendanceRecord, 'id'> = {
          studentId: student.id,
          studentName: student.name,
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
    if (!verificationState.student) return;
    setVerificationState(prev => ({ ...prev, isVerifying: true }));
    
    // The photoDataUri would come from a live camera feed in a real app.
    // Here we use a placeholder.
    const photoDataUri = 'data:image/jpeg;base64,'; // Simplified for simulation
    
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
      
      <Dialog open={!!verificationState.student && !verificationState.isVerifying} onOpenChange={() => verificationState.isVerifying ? null : setVerificationState({ student: null, prompt: '', isVerifying: false })}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Liveness Verification for {verificationState.student?.name}</DialogTitle>
            <DialogDescription>
              Please ask the student to perform the following action to verify their presence.
            </DialogDescription>
          </DialogHeader>
          <div className="my-6 p-4 bg-secondary rounded-lg text-center">
            <p className="text-2xl font-bold text-primary">{verificationState.prompt}</p>
          </div>
          <Button onClick={handleVerification} disabled={verificationState.isVerifying} className="w-full">
            {verificationState.isVerifying ? <Loader className="animate-spin mr-2" /> : <ShieldCheck className="mr-2" />}
            Confirm Liveness
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}
