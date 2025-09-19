import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SettingsPage() {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Settings"
        description="Manage application settings and configurations."
      />
      <div className="mt-8 grid gap-8">
         <Card>
          <CardHeader>
            <CardTitle>Admin Controls</CardTitle>
            <CardDescription>
              These settings are for administrative purposes and will eventually be restricted to admin users.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p>Admin features like manual data entry, user management, and system configuration will be available here.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
