import type { Student, AttendanceRecord } from '@/types';
import placeholderImages from './placeholder-images.json';

export const STUDENTS: Student[] = placeholderImages.placeholderImages.slice(0, 12).map((img, index) => ({
    id: (1001 + index).toString(),
    name: `Student #${1001 + index}`,
    avatar: img.imageUrl,
}));


export const ATTENDANCE_RECORDS: AttendanceRecord[] = [
  {
    id: 'rec1',
    studentId: '1001',
    studentName: 'Student #1001',
    date: '2024-07-20',
    status: 'Present',
    verification: 'Verified',
  },
  {
    id: 'rec2',
    studentId: '1002',
    studentName: 'Student #1002',
    date: '2024-07-20',
    status: 'Present',
    verification: 'Not Required',
  },
  {
    id: 'rec3',
    studentId: '1003',
    studentName: 'Student #1003',
    date: '2024-07-20',
    status: 'Absent',
    verification: 'Not Required',
  },
    {
    id: 'rec4',
    studentId: '1004',
    studentName: 'Student #1004',
    date: '2024-07-20',
    status: 'Present',
    verification: 'Failed',
  },
];
