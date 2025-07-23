import React, { useState } from 'react';
import { User } from '../types';
import { authenticateUser } from '../utils/auth';
import { Building2, Eye, EyeOff, Shield, Users, Clock, FileText } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  const [employeeId, setEmployeeId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const demoAccounts = [
    { id: 'HR001', role: 'HR Admin', icon: Shield, color: 'bg-red-500', description: 'Full system access' },
    { id: 'EMP001', role: 'Employee', icon: Users, color: 'bg-blue-500', description: 'Employee self-service' },
    { id: 'INT001', role: 'Intern', icon: Clock, color: 'bg-green-500', description: 'Learning dashboard' },
    { id: 'VP001', role: 'VP Operations', icon: FileText, color: 'bg-purple-500', description: 'Operations oversight' },
    { id: 'IT001', role: 'IT Head', icon: Shield, color: 'bg-orange-500', description: 'System administration' }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await authenticateUser(
        employeeId,
        password,
        { employeeId, password } // third argument: the LoginCredentials object
      );
      if (user) {
        onLogin(user);
      } else {
        setError('Invalid employee ID or password');
      }
    } catch {
      setError('Authentication failed. Please try again.');
    }
  };

  const handleDemoLogin = (demoId: string) => {
    setEmployeeId(demoId);
    setPassword('password123');
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23f1f5f9' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto grid lg:grid-cols-2 gap-8 items-center">
        {/* Left Side - Branding */}
        <div className="hidden lg:block space-y-8">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">HR Portal</h1>
                <p className="text-gray-600">Enterprise Human Resources</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-gray-800">Streamline Your HR Operations</h2>
              <div className="grid gap-4">
                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Employee Management</p>
                    <p className="text-sm text-gray-600">Complete 201 files and records</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Leave Management</p>
                    <p className="text-sm text-gray-600">Automated approval workflows</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-4 bg-white/50 backdrop-blur-sm rounded-lg border border-white/20">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">Payroll Processing</p>
                    <p className="text-sm text-gray-600">Semi-monthly automated payroll</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-1/4 mx-auto flex items-center min-h-[75vh]">
          <div className="bg-white/80 backdrop-blur-xl rounded-md shadow-xl border border-white/20 p-6 w-full">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-4 lg:hidden">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Welcome Back</h2>
              <p className="text-lg text-gray-600">Sign in to access your HR portal</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <div>
                  <label htmlFor="employeeId" className="block text-lg font-medium text-gray-700 mb-4">
                    Employee ID
                  </label>
                  <input
                    id="employeeId"
                    type="text"
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="w-full px-4 py-5 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-lg"
                    placeholder="Enter your employee ID"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="password" className="block text-lg font-medium text-gray-700 mb-4">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-4 py-5 pr-14 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50 backdrop-blur-sm text-lg"
                      placeholder="Enter your password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    >
                      {showPassword ? <EyeOff className="w-6 h-6" /> : <Eye className="w-6 h-6" />}
                    </button>
                  </div>
                </div>
              </div>

              {error && (
                <div className="p-5 bg-red-50 border border-red-200 rounded-lg animate-pulse">
                  <p className="text-lg text-red-600">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-5 px-4 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] text-lg"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Signing in...</span>
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>

            {/* Demo Accounts - Remove this section for production */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <details className="group">
                <summary className="text-base font-medium text-gray-600 cursor-pointer hover:text-gray-800 transition-colors text-center list-none mb-4">
                  <span className="inline-flex items-center gap-1">
                    Demo Accounts
                    <svg className="w-6 h-6 transition-transform group-open:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </span>
                </summary>
                <div className="mt-4 space-y-3">
                {demoAccounts.map((account) => {
                  const IconComponent = account.icon;
                  return (
                    <button
                      key={account.id}
                      onClick={() => handleDemoLogin(account.id)}
                      className="flex items-center space-x-4 p-4 bg-gray-50/80 hover:bg-white/80 rounded-lg transition-all duration-200 text-left border border-transparent hover:border-gray-200 hover:shadow-sm group w-full"
                    >
                        <div className={`w-10 h-10 ${account.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 text-base">{account.id}</p>
                          <p className="text-sm text-gray-500 truncate">{account.description}</p>
                      </div>
                        <div className="text-base text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity text-right">
                        Click
                      </div>
                    </button>
                  );
                })}
                  <p className="text-base text-gray-500 text-center mt-4 pt-4 border-t border-gray-100">
                    Password: <code className="bg-gray-100 px-3 py-2 rounded text-base">password123</code>
                  </p>
                </div>
              </details>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};