import React, { useState, useEffect } from "react";
import { FiDownload, FiFilter, FiCalendar } from "react-icons/fi";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  LineChart,
  Line,
  ResponsiveContainer
} from "recharts";

const Dashboard = () => {
  const [reportType, setReportType] = useState("sales");
  const [dateRange, setDateRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [salesData, setSalesData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [engagementData, setEngagementData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [activeUsers, setActiveUsers] = useState(0);
  const [conversionRate, setConversionRate] = useState(0);

  // Fetch data dynamically from API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Replace with your real API endpoints
        const [salesResponse, pieResponse, engagementResponse] = await Promise.all([
          fetch("http://localhost:5000/api/sales"),
          fetch("http://localhost:5000/api/pie-data"),
          fetch("http://localhost:5000/api/engagement-data")
      ]);
        
          const salesData = await salesResponse.json();
          const pieData = await pieResponse.json();
          const engagementData = await engagementResponse.json();

        // Set fetched data to state
        setSalesData(salesData);
        setPieData(pieData);
        setEngagementData(engagementData);

        // Set summary data
        setTotalSales(salesData.reduce((sum, item) => sum + item.sales, 0));
        setActiveUsers(engagementData.reduce((sum, item) => sum + item.users, 0));
        setConversionRate(0.23);  // This could be fetched as well from API
        setLoading(false);
      } catch (err) {
        setError("Failed to load report data");
        setLoading(false);
      }
    };

    fetchData();
  }, [reportType, dateRange]);

  const handleExport = (format) => {
    console.log(`Exporting report in ${format} format`);
    setTimeout(() => {
      alert(`Report downloaded in ${format} format`);
      setShowDownloadMenu(false);
    }, 1000);
  };

  const DownloadMenu = () => (
    <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
      <div className="py-1" role="menu" aria-orientation="vertical">
        <button
          onClick={() => handleExport("pdf")}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Download as PDF
        </button>
        <button
          onClick={() => handleExport("excel")}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Download as Excel
        </button>
        <button
          onClick={() => handleExport("csv")}
          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
          role="menuitem"
        >
          Download as CSV
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="text-destructive text-lg">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-h-[96vh] bg-background p-6 overflow-auto   [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-track]:bg-gray-100   [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
    <div className=" bg-background p-6 overflow-auto">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-heading font-heading text-foreground">Reports Dashboard</h1>
          <p className="text-body text-accent">Analysis and Insights</p>
        </div>
        <div className="relative">
          <button
            onClick={() => setShowDownloadMenu(!showDownloadMenu)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <FiDownload />
            Download Reports
          </button>
          {showDownloadMenu && <DownloadMenu />}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="font-heading mb-2">Total Sales</h3>
          {/* <p className="text-2xl font-bold text-primary">${totalSales}</p> */}
          <p className="text-2xl font-bold text-primary">$ 72745</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="font-heading mb-2">Active Users</h3>
          <p className="text-2xl font-bold text-chart-2">{activeUsers}</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="font-heading mb-2">Conversion Rate</h3>
          <p className="text-2xl font-bold text-chart-3">{conversionRate}%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading">Sales Performance</h2>
            <div className="flex gap-2">
              <button
                onClick={() => handleExport("pdf")}
                className="p-2 text-accent hover:text-primary transition-colors"
                aria-label="Download PDF"
              >
                <FiDownload />
              </button>
              <button
                className="p-2 text-accent hover:text-primary transition-colors"
                aria-label="Filter"
              >
                <FiFilter />
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={salesData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sales" fill="#0D6EFD" />
              <Bar dataKey="revenue" fill="#4CAF50" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading">Revenue Distribution</h2>
            <button
              className="p-2 text-accent hover:text-primary transition-colors"
              aria-label="Download CSV"
              onClick={() => handleExport("csv")}
            >
              <FiDownload />
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading">User Engagement Trends</h2>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-2 text-accent hover:text-primary transition-colors"
              aria-label="Select date range"
            >
              <FiCalendar />
              <span>Last 6 months</span>
            </button>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={engagementData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line
              type="monotone"
              dataKey="users"
              stroke="#03A9F4"
              activeDot={{ r: 8 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
    </div>
    
  );
};

export default Dashboard;
