import React from 'react';
import { BookOpen, Clock, TrendingUp, Bell, LogOut, CheckCircle, Play } from 'lucide-react';
import { IntUser } from '../types';

interface InternDashboardProps {
  user: IntUser;
  onLogout: () => void;
}

export const InternDashboard: React.FC<InternDashboardProps> = ({ user, onLogout }) => {
  const internStats = [
    { title: 'Days in Program', value: '45', icon: Clock, color: 'bg-blue-500' },
    { title: 'Completed Tasks', value: '12', icon: CheckCircle, color: 'bg-green-500' },
    { title: 'Learning Hours', value: '28', icon: BookOpen, color: 'bg-purple-500' },
    { title: 'Skill Progress', value: '73%', icon: TrendingUp, color: 'bg-orange-500' },
  ];

  const learningPath = [
    { 
      title: 'Company Orientation', 
      status: 'completed', 
      progress: 100,
      description: 'Learn about company culture and values'
    },
    { 
      title: 'Department Overview', 
      status: 'completed', 
      progress: 100,
      description: 'Understanding your department\'s role and processes'
    },
    { 
      title: 'Technical Skills Training', 
      status: 'in-progress', 
      progress: 65,
      description: 'Core technical skills for your role'
    },
    { 
      title: 'Project Management Basics', 
      status: 'pending', 
      progress: 0,
      description: 'Learn project management fundamentals'
    },
  ];

  const assignments = [
    {
      title: 'Design System Documentation',
      dueDate: 'Due Friday',
      status: 'in-progress',
      mentor: 'Sarah Johnson'
    },
    {
      title: 'User Research Analysis',
      dueDate: 'Due Next Week',
      status: 'pending',
      mentor: 'Michael Chen'
    },
    {
      title: 'Prototype Review',
      dueDate: 'Due in 2 weeks',
      status: 'upcoming',
      mentor: 'Emily Rodriguez'
    },
  ];

  const upcomingMeetings = [
    { title: '1:1 with Mentor', date: 'Today, 3:00 PM', type: 'mentor' },
    { title: 'Team Standup', date: 'Tomorrow, 9:00 AM', type: 'team' },
    { title: 'Learning Session: UI Design', date: 'Thursday, 2:00 PM', type: 'learning' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'upcoming': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Intern Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.name} • {user.department} Intern</p>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Bell className="w-5 h-5" />
              </button>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Progress Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {internStats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Learning Path & Upcoming Meetings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Learning Path */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Learning Path</h2>
              <div className="space-y-4">
                {learningPath.map((item, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${item.status === 'completed' ? 'bg-green-100' : item.status === 'in-progress' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                          {item.status === 'completed' ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <Play className="w-5 h-5 text-gray-600" />
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{item.title}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}>
                        {item.status.replace('-', ' ')}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${item.progress}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-600 mt-1 text-right">{item.progress}% Complete</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Current Assignments */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-6">Current Assignments</h2>
              <div className="space-y-4">
                {assignments.map((assignment, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{assignment.title}</h3>
                        <p className="text-sm text-gray-600 mt-1">Mentor: {assignment.mentor}</p>
                        <p className="text-sm text-blue-600 mt-2">{assignment.dueDate}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status.replace('-', ' ')}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - Upcoming Meetings */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Meetings</h2>
              <div className="space-y-4">
                {upcomingMeetings.map((meeting, index) => (
                  <div key={index} className="p-4 rounded-lg border border-gray-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0"></div>
                      <div>
                        <h3 className="font-medium text-gray-900 text-sm">{meeting.title}</h3>
                        <p className="text-xs text-gray-600 mt-1">{meeting.date}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Mentor Info */}
              <div className="mt-8 p-4 bg-blue-50 rounded-lg">
                <h3 className="font-medium text-blue-900 mb-2">Your Mentor</h3>
                <p className="text-sm text-blue-800">Sarah Johnson</p>
                <p className="text-xs text-blue-600">Senior Designer • HR Department</p>
                <button className="mt-3 text-xs bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors">
                  Schedule Meeting
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};