import { useSidebar } from '@/hooks/use-sidebar';
import { SidebarTrigger } from '@/components/ui/sidebar';

type PageHeaderProps = {
  title: string;
  description?: string;
};

export function PageHeader({ title, description }: PageHeaderProps) {
  const { isInsideSidebar } = useSidebar();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/30 px-4 backdrop-blur-sm md:px-6">
      <div className="flex items-center gap-2">
        {isInsideSidebar && <SidebarTrigger className="md:hidden" />}
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </header>
  );
}
