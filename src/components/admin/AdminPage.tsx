import React from 'react';
import { useContent } from '../../context/ContentContext';
import { AdminLogin } from './AdminLogin';
import { AdminDashboard } from './AdminDashboard';

interface AdminPageProps {
  onBackToSite: () => void;
}

export const AdminPage: React.FC<AdminPageProps> = ({ onBackToSite }) => {
  const { isAuthenticated, login, adminUsername } = useContent();

  if (!isAuthenticated) {
    return (
      <AdminLogin
        onLogin={login}
        onBackToSite={onBackToSite}
        adminUsername={adminUsername}
      />
    );
  }

  return <AdminDashboard onViewLiveSite={onBackToSite} />;
};
