import { DashboardLayoutShell } from '@/components/common/DashboardLayoutShell';

export const dynamic = 'force-dynamic';

export default function VagasDashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardLayoutShell>{children}</DashboardLayoutShell>;
}
