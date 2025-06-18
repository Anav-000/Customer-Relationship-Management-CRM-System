import React, { useState, useEffect } from "react";
import { FiDownload, FiFilter, FiCalendar, FiCheck, FiX, FiClock } from "react-icons/fi";
import { format } from "date-fns";
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

const StaffAttendance = () => {
  const [reportType, setReportType] = useState("attendance");
  const [dateRange, setDateRange] = useState("week");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);
  const [staffAttendance, setStaffAttendance] = useState([
    { id: 1, name: "John Doe", status: "present", checkIn: "09:00 AM", checkOut: "05:00 PM" },
    { id: 2, name: "Jane Smith", status: "late", checkIn: "09:30 AM", checkOut: "05:30 PM" },
    { id: 3, name: "Mike Johnson", status: "absent", checkIn: "-", checkOut: "-" },
    { id: 4, name: "Sarah Wilson", status: "present", checkIn: "08:45 AM", checkOut: "05:15 PM" },
    { id: 5, name: "Tom Brown", status: "half-day", checkIn: "09:00 AM", checkOut: "01:00 PM" },
  ]);

  const mockAttendanceData = [
    { name: "Mon", present: 45, late: 3, absent: 2 },
    { name: "Tue", present: 42, late: 5, absent: 3 },
    { name: "Wed", present: 44, late: 4, absent: 2 },
    { name: "Thu", present: 46, late: 2, absent: 2 },
    { name: "Fri", present: 43, late: 4, absent: 3 },
    { name: "Sat", present: 40, late: 3, absent: 7 },
    { name: "Sun", present: 41, late: 4, absent: 5 }
  ];

  const mockPieData = [
    { name: "Present", value: 75 },
    { name: "Late", value: 15 },
    { name: "Absent", value: 10 }
  ];

  const getStatusColor = (status) => {
    switch(status) {
      case "present": return "text-green-500";
      case "late": return "text-yellow-500";
      case "absent": return "text-red-500";
      case "half-day": return "text-orange-500";
      default: return "text-gray-500";
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1500));
        setLoading(false);
      } catch (err) {
        setError("Failed to load attendance data");
        setLoading(false);
      }
    };
    fetchData();
  }, [reportType, dateRange]);

  const handleExport = (format) => {
    console.log(`Exporting attendance report in ${format} format`);
    setTimeout(() => {
      alert(`Attendance report downloaded in ${format} format`);
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
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-heading font-heading text-foreground">Staff Attendance Dashboard</h1>
          <p className="text-body text-accent">{format(new Date(), "MMMM d, yyyy")}</p>
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
          <h3 className="font-heading mb-2">Present Today</h3>
          <p className="text-2xl font-bold text-green-500">42/50</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="font-heading mb-2">Late Arrivals</h3>
          <p className="text-2xl font-bold text-yellow-500">5</p>
        </div>
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <h3 className="font-heading mb-2">Absent</h3>
          <p className="text-2xl font-bold text-red-500">3</p>
        </div>
      </div>

      <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-heading">Today's Attendance</h2>
          <div className="flex gap-2">
            <button className="p-2 text-accent hover:text-primary transition-colors">
              <FiFilter />
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="border-b">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Staff Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check In</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Check Out</th>
              </tr>
            </thead>
            <tbody>
              {staffAttendance.map((staff) => (
                <tr key={staff.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">{staff.name}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`flex items-center ${getStatusColor(staff.status)}`}>
                      {staff.status === "present" && <FiCheck className="mr-2" />}
                      {staff.status === "late" && <FiClock className="mr-2" />}
                      {staff.status === "absent" && <FiX className="mr-2" />}
                      {staff.status.charAt(0).toUpperCase() + staff.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{staff.checkIn}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{staff.checkOut}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading">Weekly Attendance Overview</h2>
            <button className="flex items-center gap-2 text-accent hover:text-primary transition-colors">
              <FiCalendar />
              <span>This Week</span>
            </button>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={mockAttendanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="present" fill="#4CAF50" />
              <Bar dataKey="late" fill="#FFC107" />
              <Bar dataKey="absent" fill="#FF4C4C" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading">Attendance Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={mockPieData}
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
    </div>
  );
};

export default StaffAttendance;