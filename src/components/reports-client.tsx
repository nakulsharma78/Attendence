'use client';

import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import type { AttendanceRecord, VerificationStatus } from '@/types';
import { getAttendanceRecords } from '@/lib/db';
import { cn } from '@/lib/utils';

const verificationVariant: Record<
  VerificationStatus,
  'default' | 'secondary' | 'destructive' | 'outline'
> = {
  'Not Required': 'secondary',
  Pending: 'outline',
  Verified: 'default',
  Failed: 'destructive',
};

export function ReportsClient() {
  const [records, setRecords] = React.useState<AttendanceRecord[]>([]);

  React.useEffect(() => {
    setRecords(getAttendanceRecords().sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()));
  }, []);

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Student</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Verification</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {records.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                No attendance records found. Start a session from the dashboard.
              </TableCell>
            </TableRow>
          ) : (
            records.map((record) => (
              <TableRow key={record.id}>
                <TableCell className="font-medium">{record.studentName}</TableCell>
                <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Badge
                    variant={record.status === 'Present' ? 'default' : 'destructive'}
                    className={cn(record.status === 'Present' ? 'bg-green-600' : '')}
                  >
                    {record.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={verificationVariant[record.verification]}>
                    {record.verification}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
