import { User, LoginCredentials, LoginActivity } from '../types/index';
import { AuthError } from '../types/index';

// Mock user database with expanded roles
const mockUsers: User[] = [
  {
    id: 'HR001',
    name: 'Sarah Johnson',
    role: 'hr-admin',
    department: 'Human Resources',
    email: 'sarah.johnson@company.com',
    position: 'HR Manager'
  },
  {
    id: 'EMP001',
    name: 'Michael Chen',
    role: 'employee',
    department: 'Engineering',
    email: 'michael.chen@company.com',
    position: 'Senior Developer'
  },
  {
    id: 'EMP002',
    name: 'Emily Rodriguez',
    role: 'employee',
    department: 'Marketing',
    email: 'emily.rodriguez@company.com',
    position: 'Marketing Manager'
  },
  {
    id: 'INT001',
    name: 'Alex Thompson',
    role: 'intern',
    department: 'Design',
    email: 'alex.thompson@company.com',
    position: 'Design Intern'
  },
  {
    id: 'VP001',
    name: 'Robert Wilson',
    role: 'vp-ops',
    department: 'Operations',
    email: 'robert.wilson@company.com',
    position: 'VP Operations'
  },
  {
    id: 'IT001',
    name: 'Lisa Chang',
    role: 'it-head',
    department: 'Information Technology',
    email: 'lisa.chang@company.com',
    position: 'IT Head'
  }
];

// Allowed IP addresses (mock implementation)
const allowedIPs = ['127.0.0.1', '192.168.1.0/24', '10.0.0.0/8'];

// Session timeout in milliseconds (5 minutes)
export const SESSION_TIMEOUT = 5 * 60 * 1000;

// Login activity storage
let loginActivities: LoginActivity[] = [];

// ✅ CLEAN FUNCTION WITH SINGLE ARGUMENT
export const authenticateUser = async (
  credentials: LoginCredentials
): Promise<User> => {
  await new Promise(resolve => setTimeout(resolve, 1000));

  const { employeeId, password } = credentials;

  if (!employeeId.trim()) {
    throw new AuthError('Employee ID is required', 'employeeId');
  }

  if (!password.trim()) {
    throw new AuthError('Password is required', 'password');
  }

  const user = mockUsers.find(u => u.id.toLowerCase() === employeeId.toLowerCase());

  if (!user) {
    logLoginActivity(employeeId, 'Unknown User', 'login', false);
    throw new AuthError('Invalid Employee ID or Password', 'general');
  }

  const validPassword = password === 'password123' || password === user.id.toLowerCase();

  if (!validPassword) {
    logLoginActivity(user.id, user.name, 'login', false);
    throw new AuthError('Invalid Employee ID or Password', 'general');
  }

  const userIP = getUserIP();
  if (!isIPAllowed(userIP)) {
    logLoginActivity(user.id, user.name, 'login', false);
    throw new AuthError('Access denied from this IP address', 'general');
  }

  logLoginActivity(user.id, user.name, 'login', true);

  user.lastLogin = new Date().toISOString();
  user.ipAddress = userIP;

  return user;
};

export const logoutUser = (user: User): void => {
  logLoginActivity(user.id, user.name, 'logout', true);
};

const logLoginActivity = (
  employeeId: string, 
  employeeName: string, 
  action: 'login' | 'logout', 
  success: boolean
): void => {
  const activity: LoginActivity = {
    id: `activity_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    employeeId,
    employeeName,
    action,
    timestamp: new Date().toISOString(),
    ipAddress: getUserIP(),
    success
  };

  loginActivities.unshift(activity);
  if (loginActivities.length > 1000) {
    loginActivities = loginActivities.slice(0, 1000);
  }
};

const getUserIP = (): string => {
  return '127.0.0.1'; // Stubbed
};

const isIPAllowed = (ip: string): boolean => {
  return allowedIPs.some(allowedIP => {
    if (allowedIP.includes('/')) return true;
    return ip === allowedIP;
  });
};

export const getLoginActivities = (): LoginActivity[] => {
  return loginActivities;
};

export const checkSessionTimeout = (lastActivity: number): boolean => {
  return Date.now() - lastActivity > SESSION_TIMEOUT;
};
