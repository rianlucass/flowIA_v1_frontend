import { AppSidebar } from '@/components/common/AppSidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="ml-64 flex-1 p-8">{children}</main>
    </div>
  );
}
