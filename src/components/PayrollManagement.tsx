import React, { useState } from 'react';
import { 
  DollarSign, 
  FileText, 
  Download, 
  Eye, 
  Plus,
  Search,
  CheckCircle,
  Clock,
  Edit,
  X,
  Calculator
} from 'lucide-react';
import { PayrollRecord, PayrollAdjustment, Payslip, User } from '../types';

interface PayrollManagementProps {
  user: User;
}

export const PayrollManagement: React.FC<PayrollManagementProps> = ({ user }) => {
  const [activeTab, setActiveTab] = useState('payroll');
  const [showPayrollModal, setShowPayrollModal] = useState(false);
  const [showAdjustmentModal, setShowAdjustmentModal] = useState(false);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [periodFilter, setPeriodFilter] = useState('');

  // Mock payroll data
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>([
    {
      id: 'PR001',
      employeeId: 'EMP001',
      employeeName: 'Michael Chen',
      payPeriod: '2024-01-15',
      payDate: '2024-01-15',
      basicPay: 42500,
      overtime: 5000,
      commissions: 2000,
      allowances: 3000,
      grossPay: 52500,
      sss: 2362.50,
      philHealth: 1312.50,
      pagIbig: 200,
      tax: 8500,
      loans: 1000,
      totalDeductions: 13375,
      netPay: 39125,
      status: 'paid',
      adjustments: [],
      auditTrail: [
        {
          id: 'AT001',
          action: 'Created',
          field: 'payroll',
          oldValue: '',
          newValue: 'Initial payroll creation',
          changedBy: 'Sarah Johnson',
          timestamp: '2024-01-10T09:00:00Z',
          reason: 'Regular payroll processing'
        }
      ]
    },
    {
      id: 'PR002',
      employeeId: 'EMP002',
      employeeName: 'Emily Rodriguez',
      payPeriod: '2024-01-15',
      payDate: '2024-01-15',
      basicPay: 37500,
      overtime: 3000,
      commissions: 1500,
      allowances: 2500,
      grossPay: 44500,
      sss: 2025,
      philHealth: 1112.50,
      pagIbig: 200,
      tax: 6800,
      loans: 500,
      totalDeductions: 10637.50,
      netPay: 33862.50,
      status: 'processed',
      adjustments: [],
      auditTrail: []
    }
  ]);

  const [payslips] = useState<Payslip[]>([
    {
      id: 'PS001',
      employeeId: 'EMP001',
      payrollId: 'PR001',
      generatedDate: '2024-01-15T10:00:00Z',
      deliveredDate: '2024-01-15T16:00:00Z',
      pdfUrl: '/payslips/PS001.pdf'
    }
  ]);

  const [newAdjustment, setNewAdjustment] = useState<Partial<PayrollAdjustment>>({
    type: 'addition',
    description: '',
    amount: 0,
    reason: ''
  });

  const payPeriods = [
    '2024-01-15', '2024-01-30', '2024-02-15', '2024-02-28',
    '2024-03-15', '2024-03-30'
  ];

  const filteredPayroll = payrollRecords.filter(record => {
    const matchesSearch = searchTerm === '' || 
      record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPeriod = periodFilter === '' || record.payPeriod === periodFilter;
    
    return matchesSearch && matchesPeriod;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'processed': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleAddAdjustment = () => {
    if (!selectedPayroll || !newAdjustment.description || !newAdjustment.amount) return;

    const adjustment: PayrollAdjustment = {
      id: `ADJ${Date.now()}`,
      type: newAdjustment.type!,
      description: newAdjustment.description,
      amount: newAdjustment.amount,
      reason: newAdjustment.reason!,
      approvedBy: user.name,
      timestamp: new Date().toISOString()
    };

    // Update payroll record
    const updatedPayroll = {
      ...selectedPayroll,
      adjustments: [...(selectedPayroll.adjustments || []), adjustment]
    };

    // Recalculate totals
    const adjustmentTotal = updatedPayroll.adjustments.reduce((sum, adj) => {
      return adj.type === 'addition' ? sum + adj.amount : sum - adj.amount;
    }, 0);

    updatedPayroll.netPay = updatedPayroll.grossPay - updatedPayroll.totalDeductions + adjustmentTotal;

    setPayrollRecords(prev => prev.map(p => p.id === selectedPayroll.id ? updatedPayroll : p));
    setSelectedPayroll(updatedPayroll);

    // Add audit trail
    const auditEntry = {
      id: `AT${Date.now()}`,
      action: 'Adjustment Added',
      field: 'adjustments',
      oldValue: selectedPayroll.adjustments?.length.toString() || '0',
      newValue: updatedPayroll.adjustments.length.toString(),
      changedBy: user.name,
      timestamp: new Date().toISOString(),
      reason: `${adjustment.type}: ${adjustment.description}`
    };

    updatedPayroll.auditTrail.push(auditEntry);

    setNewAdjustment({
      type: 'addition',
      description: '',
      amount: 0,
      reason: ''
    });
    setShowAdjustmentModal(false);
  };

  const generatePayslip = (payrollId: string) => {
    // In a real app, this would generate and download a PDF
    alert(`Generating payslip for payroll ${payrollId}...`);
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Payroll</p>
              <p className="text-2xl font-bold text-green-600">₱{payrollRecords.reduce((sum, p) => sum + p.netPay, 0).toLocaleString()}</p>
            </div>
            <DollarSign className="w-8 h-8 text-green-500" />
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Processed</p>
              <p className="text-2xl font-bold text-blue-600">{payrollRecords.filter(p => p.status === 'processed').length}</p>
            </div>
            <Clock className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Paid</p>
              <p className="text-2xl font-bold text-green-600">{payrollRecords.filter(p => p.status === 'paid').length}</p>
            </div>
            <CheckCircle className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Payslips Generated</p>
              <p className="text-2xl font-bold text-purple-600">{payslips.length}</p>
            </div>
            <FileText className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('payroll')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payroll'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payroll Records
            </button>
            <button
              onClick={() => setActiveTab('payslips')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'payslips'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Payslips
            </button>
          </nav>
        </div>

        <div className="p-6">
          {/* Header with Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">All Periods</option>
              {payPeriods.map(period => (
                <option key={period} value={period}>
                  {new Date(period).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </option>
              ))}
            </select>
            {user.role === 'hr-admin' && (
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                <Plus className="w-4 h-4" />
                Process Payroll
              </button>
            )}
          </div>

          {/* Payroll Table */}
          {activeTab === 'payroll' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Period</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Gross Pay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Deductions</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Net Pay</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredPayroll.map((record) => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div>
                          <div className="text-sm font-medium text-gray-900">{record.employeeName}</div>
                          <div className="text-sm text-gray-500">{record.employeeId}</div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(record.payPeriod).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₱{record.grossPay.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        ₱{record.totalDeductions.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        ₱{record.netPay.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(record.status)}`}>
                          {record.status.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => {
                              setSelectedPayroll(record);
                              setShowPayrollModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {user.role === 'hr-admin' && (
                            <button
                              onClick={() => {
                                setSelectedPayroll(record);
                                setShowAdjustmentModal(true);
                              }}
                              className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                              title="Add Adjustment"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => generatePayslip(record.id)}
                            className="text-purple-600 hover:text-purple-900 p-1 rounded hover:bg-purple-50 transition-colors"
                            title="Generate Payslip"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Payslips Table */}
          {activeTab === 'payslips' && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Employee</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Generated</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Delivered</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {payslips.map((payslip) => {
                    const payroll = payrollRecords.find(p => p.id === payslip.payrollId);
                    return (
                      <tr key={payslip.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payroll?.employeeName}</div>
                          <div className="text-sm text-gray-500">{payroll?.employeeId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {new Date(payslip.generatedDate).toLocaleString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payslip.deliveredDate ? new Date(payslip.deliveredDate).toLocaleString() : 'Pending'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => window.open(payslip.pdfUrl, '_blank')}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                            title="Download Payslip"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Payroll Details Modal */}
      {showPayrollModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Payroll Details - {selectedPayroll.employeeName}
                </h2>
                <button
                  onClick={() => setShowPayrollModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {/* Basic Info */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pay Period</label>
                  <p className="text-gray-900">{new Date(selectedPayroll.payPeriod).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Pay Date</label>
                  <p className="text-gray-900">{new Date(selectedPayroll.payDate).toLocaleDateString()}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedPayroll.status)}`}>
                    {selectedPayroll.status.toUpperCase()}
                  </span>
                </div>
              </div>

              {/* Earnings */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Earnings</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>Basic Pay:</span>
                    <span>₱{selectedPayroll.basicPay.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Overtime:</span>
                    <span>₱{selectedPayroll.overtime.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Commissions:</span>
                    <span>₱{selectedPayroll.commissions.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Allowances:</span>
                    <span>₱{selectedPayroll.allowances.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Gross Pay:</span>
                    <span>₱{selectedPayroll.grossPay.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Deductions */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Deductions</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span>SSS:</span>
                    <span>₱{selectedPayroll.sss.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>PhilHealth:</span>
                    <span>₱{selectedPayroll.philHealth.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Pag-IBIG:</span>
                    <span>₱{selectedPayroll.pagIbig.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax:</span>
                    <span>₱{selectedPayroll.tax.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Loans:</span>
                    <span>₱{selectedPayroll.loans.toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-semibold">
                    <span>Total Deductions:</span>
                    <span>₱{selectedPayroll.totalDeductions.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Adjustments */}
              {selectedPayroll.adjustments && selectedPayroll.adjustments.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Adjustments</h3>
                  <div className="space-y-2">
                    {selectedPayroll.adjustments.map((adj, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                        <div>
                          <p className="font-medium">{adj.description}</p>
                          <p className="text-sm text-gray-600">{adj.reason}</p>
                          <p className="text-xs text-gray-500">
                            By {adj.approvedBy} on {new Date(adj.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <span className={`font-semibold ${adj.type === 'addition' ? 'text-green-600' : 'text-red-600'}`}>
                          {adj.type === 'addition' ? '+' : '-'}₱{adj.amount.toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Net Pay */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-blue-900">Net Pay:</span>
                  <span className="text-2xl font-bold text-blue-900">₱{selectedPayroll.netPay.toLocaleString()}</span>
                </div>
              </div>

              {/* Audit Trail */}
              {selectedPayroll.auditTrail.length > 0 && (
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-3">Audit Trail</h3>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {selectedPayroll.auditTrail.map((audit, index) => (
                      <div key={index} className="text-sm bg-gray-50 rounded p-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{audit.action}</span>
                          <span className="text-gray-500">{new Date(audit.timestamp).toLocaleString()}</span>
                        </div>
                        <p className="text-gray-600">{audit.reason}</p>
                        <p className="text-xs text-gray-500">Changed by {audit.changedBy}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => generatePayslip(selectedPayroll.id)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Generate Payslip
              </button>
              <button
                onClick={() => setShowPayrollModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Adjustment Modal */}
      {showAdjustmentModal && selectedPayroll && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Add Payroll Adjustment</h2>
                <button
                  onClick={() => setShowAdjustmentModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={newAdjustment.type}
                  onChange={(e) => setNewAdjustment(prev => ({ ...prev, type: e.target.value as 'addition' | 'deduction' }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="addition">Addition</option>
                  <option value="deduction">Deduction</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <input
                  type="text"
                  value={newAdjustment.description}
                  onChange={(e) => setNewAdjustment(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Overtime adjustment, Bonus, etc."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                <input
                  type="number"
                  value={newAdjustment.amount}
                  onChange={(e) => setNewAdjustment(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  value={newAdjustment.reason}
                  onChange={(e) => setNewAdjustment(prev => ({ ...prev, reason: e.target.value }))}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Explain the reason for this adjustment..."
                />
              </div>
            </div>
            <div className="p-6 border-t bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setShowAdjustmentModal(false)}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddAdjustment}
                disabled={!newAdjustment.description || !newAdjustment.amount || !newAdjustment.reason}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Calculator className="w-4 h-4" />
                Add Adjustment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};