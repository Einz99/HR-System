export interface User {
  id: string;
  name: string;
  role: 'hr-admin' | 'employee' | 'intern' | 'vp-ops' | 'it-head';
  department?: string;
  email?: string;
  position?: string;
  ipAddress?: string;
  lastLogin?: string;
}

export interface LoginCredentials {
  employeeId: string;
  password: string;
}

export class AuthError extends Error {
  field?: string;

  constructor(message: string, field?: string) {
    super(message);
    this.name = 'AuthError';
    this.field = field;
  }
}

export interface LoginActivity {
  id: string;
  employeeId: string;
  employeeName: string;
  action: 'login' | 'logout';
  timestamp: string;
  ipAddress: string;
  success: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: 'vacation' | 'sick' | 'maternity' | 'emergency';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'pending' | 'hr-approved' | 'vp-approved' | 'it-approved' | 'rejected';
  approvedBy?: string;
  rejectedBy?: string;
  rejectionReason?: string;
  submittedDate: string;
  documents?: string[];
  approvalHistory: ApprovalStep[];
}

export interface ApprovalStep {
  step: 'hr-admin' | 'vp-ops' | 'it-head';
  approver?: string;
  status: 'pending' | 'approved' | 'rejected';
  timestamp?: string;
  comments?: string;
}

export interface LeaveBalance {
  employeeId: string;
  vacation: number;
  sick: number;
  maternity: number;
  emergency: number;
  year: number;
}

export interface EmployeeProfile {
  id: string;
  name: string;
  email: string;
  department: string;
  position: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  classification: 'regular' | 'probationary' | 'part-time' | 'contractual';
  joinDate: string;
  birthDate: string;
  phone: string;
  address: string;
  emergencyContact: string;
  emergencyPhone: string;
  salary: string;
  profilePicture?: string;
  idDocument?: string;
  contract?: string;
  employmentHistory: EmploymentRecord[];
}

export interface EmploymentRecord {
  id: string;
  position: string;
  department: string;
  salary: string;
  startDate: string;
  endDate?: string;
  reason?: string;
}

export interface PayrollRecord {
  id: string;
  employeeId: string;
  employeeName: string;
  payPeriod: string;
  payDate: string;
  basicPay: number;
  overtime: number;
  commissions: number;
  allowances: number;
  grossPay: number;
  sss: number;
  philHealth: number;
  pagIbig: number;
  tax: number;
  loans: number;
  totalDeductions: number;
  netPay: number;
  status: 'draft' | 'processed' | 'paid';
  adjustments?: PayrollAdjustment[];
  auditTrail: PayrollAudit[];
}

export interface PayrollAdjustment {
  id: string;
  type: 'addition' | 'deduction';
  description: string;
  amount: number;
  reason: string;
  approvedBy: string;
  timestamp: string;
}

export interface PayrollAudit {
  id: string;
  action: string;
  field: string;
  oldValue: string;
  newValue: string;
  changedBy: string;
  timestamp: string;
  reason: string;
}

export interface Payslip {
  id: string;
  employeeId: string;
  payrollId: string;
  generatedDate: string;
  deliveredDate?: string;
  pdfUrl?: string;
}

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  timeIn?: string;
  timeOut?: string;
  hoursWorked: number;
  overtimeHours: number;
  status: 'present' | 'absent' | 'late' | 'on-leave';
}