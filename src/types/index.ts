export type Student = {
  id: string;
  name: string;
  avatar: string;
};

export type AttendanceStatus = 'Present' | 'Absent' | 'Unmarked' | 'Scanning';

export type VerificationStatus = 'Verified' | 'Pending' | 'Failed' | 'Not Required';

export type AttendanceRecord = {
  id: string;
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  status: 'Present' | 'Absent';
  verification: VerificationStatus;
};
