
export interface User {
  id: string;
  username: string;
  email: string;
  password?: string;
}

export interface Employee {
  id: string;
  fullName: string;
  email: string;
  position: string;
  monthlyIncome: number;
  dateJoined: string;
  status?: 'Active' | 'On Leave' | 'Terminated';
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface FinancialStats {
  totalExpenditure: number;
  remainingBudget: number;
  employeeCount: number;
  averageSalary: number;
}

export interface AppSettings {
  monthlyBudget: number;
  taxRate: number;
  currency: 'INR' | 'USD' | 'EUR';
}
