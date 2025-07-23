import React, { useState } from 'react';
import { LoginPage } from './components/LoginPage';
import { HRDashboard } from './components/HRDashboard';
import { EmployeeDashboard } from './components/EmployeeDashboard';
import { InternDashboard } from './components/InternDashboard';
import { User } from './types';
import { logoutUser, checkSessionTimeout, SESSION_TIMEOUT } from './utils/auth';

function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [lastActivity, setLastActivity] = useState<number>(Date.now());

  // Session timeout check
  React.useEffect(() => {
    if (!currentUser) return;

    const interval = setInterval(() => {
      if (checkSessionTimeout(lastActivity)) {
        handleLogout();
        alert('Your session has expired due to inactivity. Please log in again.');
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, [currentUser, lastActivity]);

  // Update last activity on user interaction
  React.useEffect(() => {
    const updateActivity = () => setLastActivity(Date.now());
    
    document.addEventListener('mousedown', updateActivity);
    document.addEventListener('keydown', updateActivity);
    document.addEventListener('scroll', updateActivity);
    
    return () => {
      document.removeEventListener('mousedown', updateActivity);
      document.removeEventListener('keydown', updateActivity);
      document.removeEventListener('scroll', updateActivity);
    };
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setLastActivity(Date.now());
  };

  const handleLogout = () => {
    if (currentUser) {
      logoutUser(currentUser);
    }
    setCurrentUser(null);
    setLastActivity(Date.now());
  };

  const renderDashboard = () => {
    if (!currentUser) return null;

    switch (currentUser.role) {
      case 'hr-admin':
        return <HRDashboard user={currentUser} onLogout={handleLogout} />;
      case 'employee':
        return <EmployeeDashboard user={currentUser} onLogout={handleLogout} />;
      case 'intern':
        return <InternDashboard user={currentUser} onLogout={handleLogout} />;
      case 'vp-ops':
        return <HRDashboard user={currentUser} onLogout={handleLogout} />;
      case 'it-head':
        return <HRDashboard user={currentUser} onLogout={handleLogout} />;
      default:
        return <LoginPage onLogin={handleLogin} />;
    }
  };

  if (!currentUser) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return renderDashboard();
}

export default App;