import { useAuth } from '../context/AuthContext';
import { useData } from '../context/DataContext';
import AdminDashboard from '../components/Dashboard/AdminDashboard';
import StaffDashboard from '../components/Dashboard/StaffDashboard';

export default function Dashboard() {
  const { currentUser } = useAuth();
  if (!currentUser) return null;
  return currentUser.role === 'admin' ? <AdminDashboard /> : <StaffDashboard />;
}