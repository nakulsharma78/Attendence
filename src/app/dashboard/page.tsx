"use client";
import { PageHeader } from '@/components/page-header';
import { DashboardClient } from '@/components/dashboard-client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, School } from 'lucide-react';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Dashboard"
        description="Your Institution Name - Real-time attendance monitoring."
      />
      <div className="flex-grow p-6 pt-0 space-y-6">
        <Card>
           <CardHeader>
            <CardTitle>Admin Actions</CardTitle>
            <CardDescription>Quick access to manage your institution's settings.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <Button variant="outline">
              <BookOpen className="mr-2 h-4 w-4" />
              Manage Subjects
            </Button>
            <Button variant="outline">
              <School className="mr-2 h-4 w-4" />
              Manage Classes
            </Button>
          </CardContent>
        </Card>
        <Card className="h-full flex-grow">
          <CardContent className="p-2 h-full">
            <DashboardClient />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
