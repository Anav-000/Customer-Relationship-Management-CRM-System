import React, { useState, useEffect } from "react";
// import { format } from "date-fns";
import { BiExport } from "react-icons/bi";
import { FiSun, FiMoon } from "react-icons/fi";
import { Line, Pie } from "recharts";
import { FaSearch, FaFilter, FaSort } from "react-icons/fa";

const Payment = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [filterStatus, setFilterStatus] = useState("all");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [searchQuery, setSearchQuery] = useState("");

  const mockTransactions = [
    {
      id: "TRX001",
      date: "2024-01-15",
      amount: 1500.00,
      status: "completed",
      method: "credit_card",
      sender: "John Doe",
      recipient: "ABC Corp"
    },
    {
      id: "TRX002",
      date: "2024-01-14",
      amount: 2300.50,
      status: "pending",
      method: "bank_transfer",
      sender: "Jane Smith",
      recipient: "XYZ Ltd"
    },
    // Add more mock data as needed
  ];

  const summaryData = {
    totalReceived: 45000.00,
    totalPending: 12500.00,
    totalFailed: 3000.00
  };

  const pieChartData = [
    { name: "Credit Card", value: 60 },
    { name: "Bank Transfer", value: 25 },
    { name: "Digital Wallet", value: 15 }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  const handleExport = () => {
    console.log("Exporting data...");
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    // <div className={`min-h-screen ${darkMode ? "dark bg-gray-900" : "bg-gray-50 text-white"}`}>
    <div className="max-h-[96vh] bg-background p-6 overflow-auto   [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-track]:bg-gray-100   [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <div className=" mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className={`text-3xl font-bold ${darkMode ? "text-white bg-gray-900" : "text-black bg-gray-50"}`}>Payment Report </h1>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className={` hidden p-2 rounded-lg ${darkMode ? "bg-gray-700" : "bg-gray-200"
                }`}
            >
              {darkMode ? (
                <FiSun className="text-yellow-400" />
              ) : (
                <FiMoon className="text-gray-700" />
              )}
            </button>
            <button
              onClick={handleExport}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-white ${darkMode ? "bg-blue-500 hover:bg-blue-600" : "bg-blue-600 hover:bg-blue-700"
                }`}
            >
              <BiExport />
              <span>Export</span>
            </button>
          </div>

        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}>
              Total Received
            </h3>
            <p className="text-3xl font-bold text-green-600">
              ${summaryData.totalReceived.toLocaleString()}
            </p>
          </div>

          <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}>Total Pending</h3>
            <p className="text-3xl font-bold text-yellow-600">${summaryData.totalPending.toLocaleString()}</p>
          </div>
          <div className={`p-6 rounded-lg shadow-md ${darkMode ? "bg-gray-800" : "bg-white"}`}>
            <h3 className={`text-lg font-semibold mb-2 ${darkMode ? "text-white" : "text-black"}`}>Total Failed</h3>
            <p className="text-3xl font-bold text-red-600">${summaryData.totalFailed.toLocaleString()}</p>
          </div>
        </div>

        {/* Filters Section */}
        <div className={`p-6 rounded-lg shadow-md mb-8 ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <div className="flex flex-wrap gap-4">
            {/* Search Input */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="text"
                placeholder="Search transactions..."
                className={`w-full px-4 py-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                  }`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Status Dropdown */}
            <div className="flex-1 min-w-[200px]">
              <select
                className={`w-full px-4 py-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                  }`}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            {/* Date Input */}
            <div className="flex-1 min-w-[200px]">
              <input
                type="date"
                className={`w-full px-4 py-2 border rounded-lg ${darkMode ? "bg-gray-700 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
                  }`}
                value={dateRange.start}
                onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              />
            </div>
          </div>
        </div>


        {/* Transactions Table */}
        <div className={`rounded-lg shadow-md overflow-hidden ${darkMode ? "bg-gray-800" : "bg-white"}`}>
          <table className="w-full">
            <thead>
              <tr className={`${darkMode ? "bg-gray-700" : "bg-gray-100"}`}>
                <th
                  className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"
                    }`}
                >
                  Date
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"
                    }`}
                >
                  Transaction ID
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"
                    }`}
                >
                  Amount
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"
                    }`}
                >
                  Status
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"
                    }`}
                >
                  Method
                </th>
                <th
                  className={`px-6 py-3 text-left text-sm font-semibold ${darkMode ? "text-gray-200" : "text-gray-600"
                    }`}
                >
                  Sender
                </th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? "divide-gray-700" : "divide-gray-200"}`}>
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className={`cursor-pointer ${darkMode ? "hover:bg-gray-700" : "hover:bg-gray-50"
                    }`}
                >
                  <td
                    className={`px-6 py-4 text-sm ${darkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                  >
                    {/* {format(new Date(transaction.date), "MMM dd, yyyy")} */}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${darkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                  >
                    {transaction.id}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${darkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                  >
                    ${transaction.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${transaction.status === "completed"
                        ? darkMode
                          ? "bg-green-800 text-green-200"
                          : "bg-green-100 text-green-800"
                        : transaction.status === "pending"
                          ? darkMode
                            ? "bg-yellow-800 text-yellow-200"
                            : "bg-yellow-100 text-yellow-800"
                          : darkMode
                            ? "bg-red-800 text-red-200"
                            : "bg-red-100 text-red-800"
                        }`}
                    >
                      {transaction.status}
                    </span>
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${darkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                  >
                    {transaction.method}
                  </td>
                  <td
                    className={`px-6 py-4 text-sm ${darkMode ? "text-gray-200" : "text-gray-800"
                      }`}
                  >
                    {transaction.sender}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div
            className={`px-6 py-4 border-t flex justify-between items-center ${darkMode
              ? "bg-gray-700 border-gray-600"
              : "bg-gray-50 border-gray-300"
              }`}
          >
            <p
              className={`text-sm ${darkMode ? "text-gray-200" : "text-gray-700"
                }`}
            >
              Showing {(currentPage - 1) * 10 + 1} to{" "}
              {Math.min(currentPage * 10, transactions.length)} of{" "}
              {transactions.length} entries
            </p>
            <div className="flex space-x-2">
              <button
                className={`px-4 py-2 border rounded-lg ${darkMode
                  ? "dark:border-gray-600 dark:text-gray-200 hover:bg-gray-600"
                  : "border-gray-300 text-black hover:bg-gray-100"
                  }`}
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                className={`px-4 py-2 border rounded-lg ${darkMode
                  ? "dark:border-gray-600 dark:text-gray-200 hover:bg-gray-600"
                  : "border-gray-300 text-black hover:bg-gray-100"
                  }`}
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * 10 >= transactions.length}
              >
                Next
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Payment;