import { getServerSession } from 'next-auth/next';
import { authOptions } from './api/auth/[...nextauth]/route';
import { redirect } from 'next/navigation';
import PredictionDashboard from '@/components/dashboard/dashboard-page';

export default async function Dashboard() {
  const data = await getServerSession(authOptions);
  if (!data) redirect('/login');

  return <PredictionDashboard />;
}
