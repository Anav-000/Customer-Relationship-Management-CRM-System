import React, { useState, useContext, createContext } from "react";
import { FiMoon, FiSun, FiDownload, FiUser, FiDollarSign, FiPieChart, FiBarChart2 } from "react-icons/fi";
import { Line, Pie, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const ThemeContext = createContext();

const mockEmployees = [
  {
    id: 1,
    name: "John Doe",
    department: "Engineering",
    designation: "Senior Developer",
    baseSalary: 85000,
    bonus: 5000,
    deductions: 2000,
    taxInfo: { taxRate: 0.25 },
    salaryHistory: [
      { month: "Jan", amount: 85000 },
      { month: "Feb", amount: 86000 },
      { month: "Mar", amount: 85500 },
    ],
  },
  {
    id: 2,
    name: "Jane Smith",
    department: "Marketing",
    designation: "Marketing Manager",
    baseSalary: 75000,
    bonus: 4000,
    deductions: 1800,
    taxInfo: { taxRate: 0.22 },
    salaryHistory: [
      { month: "Jan", amount: 75000 },
      { month: "Feb", amount: 76000 },
      { month: "Mar", amount: 75500 },
    ],
  },
];

const StaffSalary = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  
  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
        <div className="bg-background dark:bg-dark-background text-foreground dark:text-dark-foreground min-h-screen">
          <Header toggleDarkMode={toggleDarkMode} darkMode={darkMode} />
          <div className="container mx-auto px-4 py-8">
            <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />
            <main className="mt-8">
              {activeTab === "dashboard" && <Dashboard />}
              {activeTab === "profile" && (
                <EmployeeProfile
                  employees={mockEmployees}
                  selectedEmployee={selectedEmployee}
                  setSelectedEmployee={setSelectedEmployee}
                />
              )}
              {activeTab === "calculator" && <SalaryCalculator />}
              {activeTab === "reports" && <SalaryReports employees={mockEmployees} />}
            </main>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
};

const Header = ({ toggleDarkMode, darkMode }) => (
  <header className="bg-card dark:bg-dark-card shadow-sm">
    <div className="container mx-auto px-4 py-4 flex justify-between items-center">
      <h1 className="text-heading font-heading">Salary Management System</h1>
      <button
        onClick={toggleDarkMode}
        className="p-2 rounded-full hover:bg-secondary dark:hover:bg-dark-secondary"
        aria-label="Toggle dark mode"
      >
        {darkMode ? <FiSun className="w-6 h-6" /> : <FiMoon className="w-6 h-6" />}
      </button>
    </div>
  </header>
);

const Navigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: "dashboard", label: "Dashboard", icon: FiPieChart },
    { id: "profile", label: "Employee Profiles", icon: FiUser },
    { id: "calculator", label: "Salary Calculator", icon: FiDollarSign },
    { id: "reports", label: "Reports", icon: FiBarChart2 },
  ];

  return (
    <nav className="flex space-x-4">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
            activeTab === tab.id
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary dark:hover:bg-dark-secondary"
          }`}
        >
          <tab.icon className="w-5 h-5" />
          <span>{tab.label}</span>
        </button>
      ))}
    </nav>
  );
};

const Dashboard = () => {
  const chartData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [
      {
        label: "Total Salary Expenditure",
        data: [350000, 355000, 360000, 358000, 365000, 370000],
        borderColor: "#0D6EFD",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Employees" value="125" />
        <StatCard title="Average Salary" value="$82,500" />
        <StatCard title="Monthly Expenditure" value="$1.2M" />
      </div>
      <div className="bg-card dark:bg-dark-card rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Salary Trends</h3>
        <div className="h-[300px]">
          <Line data={chartData} options={{ maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value }) => (
  <div className="bg-card dark:bg-dark-card p-6 rounded-lg shadow-sm">
    <h3 className="text-accent dark:text-dark-accent font-body mb-2">{title}</h3>
    <p className="text-2xl font-semibold">{value}</p>
  </div>
);

const EmployeeProfile = ({ employees, selectedEmployee, setSelectedEmployee }) => (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div className="md:col-span-1 bg-card dark:bg-dark-card p-6 rounded-lg shadow-sm">
      <h3 className="text-xl font-semibold mb-4">Employees</h3>
      <div className="space-y-2">
        {employees.map((employee) => (
          <button
            key={employee.id}
            onClick={() => setSelectedEmployee(employee)}
            className={`w-full text-left p-3 rounded-md ${
              selectedEmployee?.id === employee.id
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary dark:hover:bg-dark-secondary"
            }`}
          >
            {employee.name}
          </button>
        ))}
      </div>
    </div>
    <div className="md:col-span-2 bg-card dark:bg-dark-card p-6 rounded-lg shadow-sm">
      {selectedEmployee ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">{selectedEmployee.name}</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-accent dark:text-dark-accent">Department</p>
              <p className="font-semibold">{selectedEmployee.department}</p>
            </div>
            <div>
              <p className="text-accent dark:text-dark-accent">Designation</p>
              <p className="font-semibold">{selectedEmployee.designation}</p>
            </div>
            <div>
              <p className="text-accent dark:text-dark-accent">Base Salary</p>
              <p className="font-semibold">
                ${selectedEmployee.baseSalary.toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-accent dark:text-dark-accent">Bonus</p>
              <p className="font-semibold">
                ${selectedEmployee.bonus.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-accent dark:text-dark-accent text-center">
          Select an employee to view details
        </p>
      )}
    </div>
  </div>
);

const SalaryCalculator = () => {
  const [inputs, setInputs] = useState({
    basicSalary: "",
    allowances: "",
    deductions: "",
    professionalTax: "",
    providentFund: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputs((prev) => ({ ...prev, [name]: value }));
  };

  const calculateNetSalary = () => {
    const basic = Number(inputs.basicSalary) || 0;
    const allowances = Number(inputs.allowances) || 0;
    const deductions = Number(inputs.deductions) || 0;
    const tax = Number(inputs.professionalTax) || 0;
    const pf = Number(inputs.providentFund) || 0;

    return basic + allowances - deductions - tax - pf;
  };

  return (
    <div className="bg-card dark:bg-dark-card p-6 rounded-lg shadow-sm max-w-2xl mx-auto">
      <h3 className="text-xl font-semibold mb-6">Salary Calculator</h3>
      <div className="space-y-4">
        {Object.entries(inputs).map(([key, value]) => (
          <div key={key}>
            <label className="block text-accent dark:text-dark-accent mb-1">
              {key.charAt(0).toUpperCase() + key.slice(1).replace(/([A-Z])/g, " $1")}
            </label>
            <input
              type="number"
              name={key}
              value={value}
              onChange={handleChange}
              className="w-full p-2 border border-input dark:border-dark-input rounded-md bg-background dark:bg-dark-background"
            />
          </div>
        ))}
        <div className="pt-4 border-t border-border dark:border-dark-border">
          <p className="text-lg font-semibold">
            Net Salary: ${calculateNetSalary().toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  );
};

const SalaryReports = ({ employees }) => {
  const [filter, setFilter] = useState("all");

  const handleExport = () => {
    console.log("Exporting reports...");
  };

  return (
    <div className="bg-card dark:bg-dark-card p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold">Salary Reports</h3>
        <button
          onClick={handleExport}
          className="flex items-center space-x-2 bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-opacity-90"
        >
          <FiDownload />
          <span>Export</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border dark:border-dark-border">
              <th className="text-left py-3 px-4">Employee</th>
              <th className="text-left py-3 px-4">Department</th>
              <th className="text-left py-3 px-4">Base Salary</th>
              <th className="text-left py-3 px-4">Total Compensation</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr
                key={employee.id}
                className="border-b border-border dark:border-dark-border"
              >
                <td className="py-3 px-4">{employee.name}</td>
                <td className="py-3 px-4">{employee.department}</td>
                <td className="py-3 px-4">
                  ${employee.baseSalary.toLocaleString()}
                </td>
                <td className="py-3 px-4">
                  ${(employee.baseSalary + employee.bonus).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StaffSalary;
