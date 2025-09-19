import { EnrollmentClient } from '@/components/enrollment-client';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent } from '@/components/ui/card';

export default function EnrollmentPage() {
  return (
    <div className="container mx-auto py-10">
      <PageHeader
        title="Facial Enrollment"
        description="Securely enroll students by capturing and storing their facial biometrics."
      />
      <div className="mt-8">
        <EnrollmentClient />
      </div>
    </div>
  );
}
