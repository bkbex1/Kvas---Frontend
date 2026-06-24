import { ReactNode, useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiGet } from '@/lib/api';
import { useAuth } from '@/auth/AuthContext';

type MaintenanceStatus = {
  enabled: boolean;
  title?: string;
  message?: string;
};

export default function MaintenanceGate({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { user } = useAuth();
  const [status, setStatus] = useState<MaintenanceStatus>({ enabled: false });

  useEffect(() => {
    apiGet<MaintenanceStatus>('/api/content/maintenance')
      .then(setStatus)
      .catch(() => setStatus({ enabled: false }));
  }, [location.pathname]);

  const role = (user as any)?.role || (user?.isAdmin ? 'ADMIN' : 'USER');
  const isPrivileged = role === 'ADMIN' || role === 'MODERATOR';
  const isMaintenancePage = location.pathname === '/maintenance';

  if (status.enabled && !isPrivileged && !isMaintenancePage) {
    return <Navigate to="/maintenance" replace />;
  }

  if (!status.enabled && isMaintenancePage) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
