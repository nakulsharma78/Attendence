import type { Student, AttendanceRecord } from '@/types';
import { STUDENTS, ATTENDANCE_RECORDS } from '@/lib/data';

const isClient = typeof window !== 'undefined';

const STUDENTS_KEY = 'guardian-ai-students';
const ATTENDANCE_KEY = 'guardian-ai-attendance';

function initializeData<T>(key: string, initialData: T[]): T[] {
  if (!isClient) return initialData;
  const storedData = localStorage.getItem(key);
  if (storedData) {
    return JSON.parse(storedData);
  }
  localStorage.setItem(key, JSON.stringify(initialData));
  return initialData;
}

export function getStudents(): Student[] {
  return initializeData<Student>(STUDENTS_KEY, STUDENTS);
}

export function addStudent(newStudent: Student): void {
  if (!isClient) return;
  const students = getStudents();
  if (students.some(s => s.id === newStudent.id)) {
    throw new Error('A student with this ID already exists.');
  }
  const updatedStudents = [...students, newStudent];
  localStorage.setItem(STUDENTS_KEY, JSON.stringify(updatedStudents));
}

export function getAttendanceRecords(): AttendanceRecord[] {
  return initializeData<AttendanceRecord>(ATTENDANCE_KEY, ATTENDANCE_RECORDS);
}

export function addAttendanceRecord(newRecord: Omit<AttendanceRecord, 'id'>): void {
  if (!isClient) return;
  const records = getAttendanceRecords();
  const fullRecord: AttendanceRecord = {
    ...newRecord,
    id: `rec-${Date.now()}-${Math.random()}`,
  };
  const updatedRecords = [...records, fullRecord];
  localStorage.setItem(ATTENDANCE_KEY, JSON.stringify(updatedRecords));
}
