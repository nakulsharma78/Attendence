import { ShieldCheck } from "lucide-react";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t">
      <div className="container mx-auto px-4 py-6 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-6 w-6 text-primary" />
          <span className="font-bold">GuardianAI</span>
        </div>
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} GuardianAI. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
