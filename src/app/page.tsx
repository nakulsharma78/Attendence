import { PageHeader } from '@/components/page-header';
import { DashboardClient } from '@/components/dashboard-client';
import { Card, CardContent } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full">
      <PageHeader
        title="Dashboard"
        description="Real-time attendance monitoring and verification."
      />
      <div className="flex-grow p-6 pt-0">
        <Card className="h-full">
          <CardContent className="p-2 h-full">
            <DashboardClient />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
