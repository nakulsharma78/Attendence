"use client";
import { ReportsClient } from '@/components/reports-client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function ReportsPage() {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Attendance Reports"
        description="View detailed reports on student attendance history and verification status."
      />
      <div className="mt-8">
        <Card>
          <CardContent className="p-6">
            <ReportsClient />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
