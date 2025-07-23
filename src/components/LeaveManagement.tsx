import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  FileText, 
  Plus, 
  Search, 
  CheckCircle,
  XCircle,
  AlertCircle,
  Upload,
  Eye,
  X
} from 'lucide-react';
import { LeaveRequest, LeaveBalance, IntUser } from '../types';

interface LeaveManagementProps {
  user: IntUser;
}

export const LeaveManagement: React.FC<LeaveManagementProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('my-leaves');
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedLeave, setSelectedLeave] = useState<LeaveRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Mock data
  const [leaveBalance] = useState<LeaveBalance>({
    employeeId: user.id,
    vacation: 15,
    sick: 10,
    maternity: 60,
    emergency: 5,
    year: 2024
  });

  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>([
    {
      id: 'LR001',
      employeeId: user.id,
      employeeName: user.name,
      leaveType: 'vacation',
      startDate: '2024-02-15',
      endDate: '2024-02-17',
      days: 3,
      reason: 'Family vacation',
      status: 'pending',
      submittedDate: '2024-02-01',
      approvalHistory: [
        { step: 'hr-admin', status: 'pending' },
        { step: 'vp-ops', status: 'pending' },
        { step: 'it-head', status: 'pending' }
      ]
    },
    {
      id: 'LR002',
      employeeId: user.id,
      employeeName: user.name,
      leaveType: 'sick',
      startDate: '2024-01-20',
      endDate: '2024-01-22',
      days: 3,
      reason: 'Medical treatment',
      status: 'it-approved',
      submittedDate: '2024-01-18',
      approvalHistory: [
        { step: 'hr-admin', status: 'approved', approver: 'Sarah Johnson', timestamp: '2024-01-18T10:00:00Z' },
        { step: 'vp-ops', status: 'approved', approver: 'Robert Wilson', timestamp: '2024-01-18T14:00:00Z' },
        { step: 'it-head', status: 'approved', approver: 'Lisa Chang', timestamp: '2024-01-19T09:00:00Z' }
      ]
    }
  ]);

  const [newLeaveRequest, setNewLeaveRequest] = useState({
    leaveType: 'vacation' as const,
    startDate: '',
    endDate: '',
    reason: '',
    documents: [] as File[]
  });

  const leaveTypes = [
    { value: 'vacation', label: 'Vacation Leave', color: 'bg-blue-100 text-blue-800' },
    { value: 'sick', label: 'Sick Leave', color: 'bg-red-100 text-red-800' },
    { value: 'maternity', label: 'Maternity Leave', color: 'bg-pink-100 text-pink-800' },
    { value: 'emergency', label: 'Emergency Leave', color: 'bg-orange-100 text-orange-800' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'hr-approved': return 'bg-blue-100 text-blue-800';
      case 'vp-approved': return 'bg-indigo-100 text-indigo-800';
      case 'it-approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateDays = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
  };

  const handleSubmitLeave = () => {
    const days = calculateDays(newLeaveRequest.startDate, newLeaveRequest.endDate);
    
    const leaveRequest: LeaveRequest = {
      id: `LR${String(leaveRequests.length + 1).padStart(3, '0')}`,
      employeeId: user.id,
      employeeName: user.name,
      leaveType: newLeaveRequest.leaveType,
      startDate: newLeaveRequest.startDate,
      endDate: newLeaveRequest.endDate,
      days,
      reason: newLeaveRequest.reason,
      status: 'pending',
      submittedDate: new Date().toISOString().split('T')[0],
      approvalHistory: [
        { step: 'hr-admin', status: 'pending' },
        { step: 'vp-ops', status: 'pending' },
        { step: 'it-head', status: 'pending' }
      ]
    };

    setLeaveRequests(prev => [leaveRequest, ...prev]);
    setNewLeaveRequest({
      leaveType: 'vacation',
      startDate: '',
      endDate: '',
      reason: '',
      documents: []
    });
    setShowRequestModal(false);
  };

  const filteredLeaves = leaveRequests.filter(leave => {
    const matchesSearch = searchTerm === '' || 
      leave.reason.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leave.leaveType.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || leave.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Leave Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Vacation Leave</p>
              <p className="text-2xl font-bold text-blue-600">{leaveBalance.vacation}</p>
              <p className="text-xs text-gray-500">days remaining</p>
            </div>
            <Calendar className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sick Leave</p>
              <p className="text-2xl font-bold text-red-600">{leaveBalance.sick}</p>
              <p className="text-xs text-gray-500">days remaining</p>
            </div>
            <Clock className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Maternity Leave</p>
              <p className="text-2xl font-bold text-pink-600">{leaveBalance.maternity}</p>
              <p className="text-xs text-gray-500">days remaining</p>
            </div>
            <FileText className="w-8 h-8 text-pink-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Emergency Leave</p>
              <p className="text-2xl font-bold text-orange-600">{leaveBalance.emergency}</p>
              <p className="text-xs text-gray-500">days remaining</p>
            </div>
            <AlertCircle className="w-8 h-8 text-orange-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('my-leaves')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'my-leaves'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              My Leave Requests
            </button>
            {(user.role === 'hr-admin' || user.role === 'vp-ops' || user.role === 'it-head') && (
              <button
                onClick={() => setActiveTab('approvals')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === 'approvals'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Pending Approvals
              </button>
            )}
          </nav>
        </div>

        <div className="p-6">
          {/* Header with Search and Actions */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search leave requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="hr-approved">HR Approved</option>
              <option value="vp-approved">VP Approved</option>
              <option value="it-approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
            <button
              onClick={() => setShowRequestModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Request Leave
            </button>
          </div>

          {/* Leave Requests Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dates</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Days</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Submitted</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLeaves.map((leave) => (
                  <tr key={leave.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        leaveTypes.find(t => t.value === leave.leaveType)?.color
                      }`}>
                        {leaveTypes.find(t => t.value === leave.leaveType)?.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{leave.days}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(leave.status)}`}>
                        {leave.status.replace('-', ' ').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(leave.submittedDate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => {
                          setSelectedLeave(leave);
                          setShowDetailsModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Request Leave Modal */}
      {showRequestModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Request Leave</h2>
                <button
                  onClick={() => setShowRequestModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select
                  value={newLeaveRequest.leaveType}
                  onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, leaveType: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {leaveTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newLeaveRequest.startDate}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, startDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newLeaveRequest.endDate}
                    onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, endDate: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {newLeaveRequest.startDate && newLeaveRequest.endDate && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-blue-800 text-sm">
                    Total days: {calculateDays(newLeaveRequest.startDate, newLeaveRequest.endDate)}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={newLeaveRequest.reason}
                  onChange={(e) => setNewLeaveRequest(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Please provide a reason for your leave request..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Supporting Documents (Optional)</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <input
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []);
                      setNewLeaveRequest(prev => ({ ...prev, documents: files }));
                    }}
                    className="hidden"
                    id="document-upload"
                  />
                  <label htmlFor="document-upload" className="cursor-pointer text-blue-600 hover:text-blue-800">
                    Upload Documents
                  </label>
                  <p className="text-xs text-gray-500 mt-1">PDF, DOC, DOCX, JPG, PNG (Max 10MB each)</p>
                </div>
                {newLeaveRequest.documents.length > 0 && (
                  <div className="mt-2 space-y-1">
                    {newLeaveRequest.documents.map((file, index) => (
                      <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                        <FileText className="w-4 h-4" />
                        {file.name}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowRequestModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitLeave}
                disabled={!newLeaveRequest.startDate || !newLeaveRequest.endDate || !newLeaveRequest.reason}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Leave Details Modal */}
      {showDetailsModal && selectedLeave && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Leave Request Details</h2>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    leaveTypes.find(t => t.value === selectedLeave.leaveType)?.color
                  }`}>
                    {leaveTypes.find(t => t.value === selectedLeave.leaveType)?.label}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedLeave.status)}`}>
                    {selectedLeave.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <p className="text-gray-900">{new Date(selectedLeave.startDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <p className="text-gray-900">{new Date(selectedLeave.endDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Total Days</label>
                  <p className="text-gray-900">{selectedLeave.days}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Submitted Date</label>
                  <p className="text-gray-900">{new Date(selectedLeave.submittedDate).toLocaleDateString()}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <p className="text-gray-900 bg-gray-50 p-3 rounded-lg">{selectedLeave.reason}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Approval Workflow</label>
                <div className="space-y-3">
                  {selectedLeave.approvalHistory.map((step, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <div className="flex-shrink-0">
                        {step.status === 'approved' ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : step.status === 'rejected' ? (
                          <XCircle className="w-5 h-5 text-red-500" />
                        ) : (
                          <Clock className="w-5 h-5 text-yellow-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900 capitalize">
                          {step.step.replace('-', ' ')}
                        </p>
                        {step.approver && (
                          <p className="text-sm text-gray-600">
                            {step.status === 'approved' ? 'Approved' : 'Rejected'} by {step.approver}
                          </p>
                        )}
                        {step.timestamp && (
                          <p className="text-xs text-gray-500">
                            {new Date(step.timestamp).toLocaleString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end">
              <button
                onClick={() => setShowDetailsModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};