import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useSession } from '@/components/session-provider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  // Note: In a real app, you would fetch user details from your database.
  const user = {
    email: 'admin@yourinstitution.edu',
    institution: 'Your Institution Name',
    plan: 'Yearly Plan',
    status: 'Active',
  };

  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Settings"
        description="Manage application settings and configurations."
      />
      <div className="mt-8 grid gap-8 md:grid-cols-2">
         <Card>
          <CardHeader>
            <CardTitle>Profile &amp; Subscription</CardTitle>
            <CardDescription>
              View and manage your account and subscription details.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-semibold">{user.email}</span>
            </div>
             <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Institution:</span>
              <span className="font-semibold">{user.institution}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Current Plan:</span>
              <span className="font-semibold">{user.plan}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Status:</span>
              <Badge variant={user.status === 'Active' ? 'default' : 'destructive'} className={user.status === 'Active' ? 'bg-green-600' : ''}>
                {user.status}
              </Badge>
            </div>
            <Button variant="outline" className="w-full">Manage Subscription</Button>
          </CardContent>
        </Card>
         <Card>
          <CardHeader>
            <CardTitle>Admin Controls</CardTitle>
            <CardDescription>
              Manage institution-wide settings, user roles, and subscription details.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              This section is for administrative purposes. Features like manual data correction,
              user management, and system configuration will be available here for authorized admins.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
