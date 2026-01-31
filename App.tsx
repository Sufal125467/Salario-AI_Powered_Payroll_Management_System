
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import AnalyticsDashboard from './pages/AnalyticsDashboard';
import Employees from './pages/Employees';
import Payroll from './pages/Payroll';
import Auth from './pages/Auth';
import Settings from './pages/Settings';
import Home from './pages/Home';
import ChatAssistant from './components/ChatAssistant';
import { User, Employee } from './types';
import { useSettings } from './hooks/useSettings';
import { Menu, Wallet } from 'lucide-react';

const INITIAL_EMPLOYEES: Employee[] = [
  { id: '1', fullName: 'Sarah Connor', email: 'sarah@sky.net', position: 'Lead Developer', monthlyIncome: 8500, dateJoined: '2023-01-15', status: 'Active' },
  { id: '2', fullName: 'James Bond', email: '007@mi6.gov', position: 'Security Specialist', monthlyIncome: 7200, dateJoined: '2023-03-10', status: 'Active' },
  { id: '3', fullName: 'Ellen Ripley', email: 'ripley@weyland.com', position: 'Operations Manager', monthlyIncome: 9000, dateJoined: '2023-05-22', status: 'On Leave' },
];

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { settings, updateSettings, getCurrencySymbol } = useSettings();

  useEffect(() => {
    // Check local storage for session and employees
    const session = localStorage.getItem('salario_session');
    const storedEmployees = localStorage.getItem('salario_employees');
    
    if (session) {
      setCurrentUser(JSON.parse(session));
    }
    
    if (storedEmployees) {
      setEmployees(JSON.parse(storedEmployees));
    } else {
      setEmployees(INITIAL_EMPLOYEES);
      localStorage.setItem('salario_employees', JSON.stringify(INITIAL_EMPLOYEES));
    }
    
    setLoading(false);
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    localStorage.setItem('salario_session', JSON.stringify(user));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setShowAuth(false);
    localStorage.removeItem('salario_session');
    setActiveTab('dashboard');
  };

  const addEmployee = (newEmp: Employee) => {
    const updated = [newEmp, ...employees];
    setEmployees(updated);
    localStorage.setItem('salario_employees', JSON.stringify(updated));
  };

  const updateEmployee = (updatedEmp: Employee) => {
    const updated = employees.map(emp => emp.id === updatedEmp.id ? updatedEmp : emp);
    setEmployees(updated);
    localStorage.setItem('salario_employees', JSON.stringify(updated));
  };

  const deleteEmployee = (id: string) => {
    const updated = employees.filter(e => e.id !== id);
    setEmployees(updated);
    localStorage.setItem('salario_employees', JSON.stringify(updated));
  };

  const handleOpenAddEmployee = () => {
    setActiveTab('employees');
    setIsAddEmployeeModalOpen(true);
  };

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-50">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // If user is not logged in
  if (!currentUser) {
    if (showAuth) {
      return <Auth onLogin={handleLogin} />;
    }
    return <Home onStart={() => setShowAuth(true)} />;
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard employees={employees} settings={settings} currencySymbol={getCurrencySymbol()} />;
      case 'analytics':
        return <AnalyticsDashboard user={currentUser} settings={settings} currencySymbol={getCurrencySymbol()} />;
      case 'employees':
        return (
          <Employees 
            employees={employees} 
            onAdd={addEmployee} 
            onUpdate={updateEmployee}
            onDelete={deleteEmployee} 
            forceOpenModal={isAddEmployeeModalOpen}
            onModalClose={() => setIsAddEmployeeModalOpen(false)}
            currencySymbol={getCurrencySymbol()}
          />
        );
      case 'payroll':
        return <Payroll employees={employees} settings={settings} currencySymbol={getCurrencySymbol()} />;
      case 'settings':
        return <Settings settings={settings} onSave={updateSettings} />;
      default:
        return <Dashboard employees={employees} settings={settings} currencySymbol={getCurrencySymbol()} />;
    }
  };

  return (
    <div className="flex bg-slate-50 min-h-screen">
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        onLogout={handleLogout}
        user={currentUser}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Top Navbar */}
        <header className="lg:hidden flex items-center justify-between px-6 py-4 bg-white border-b border-slate-200 sticky top-0 z-50">
          <div className="flex items-center space-x-3">
            <div className="bg-emerald-500 p-2 rounded-lg">
              <Wallet className="text-white w-5 h-5" />
            </div>
            <span className="text-lg font-bold text-slate-800 tracking-tight">SALARIO</span>
          </div>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-slate-500 hover:bg-slate-50 rounded-xl"
          >
            <Menu size={24} />
          </button>
        </header>

        <main className="flex-1 lg:ml-64 p-4 md:p-10 max-w-7xl mx-auto w-full">
          {renderContent()}
        </main>
      </div>

      <ChatAssistant 
        user={currentUser} 
        employees={employees} 
        onOpenAddEmployee={handleOpenAddEmployee}
        onNavigate={setActiveTab}
      />
    </div>
  );
};

export default App;
