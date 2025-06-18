import React, { useState, useMemo } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format, isAfter, parseISO } from "date-fns";
import { FaFileDownload, FaSearch, FaSpinner } from "react-icons/fa";
import { BsArrowUp, BsArrowDown } from "react-icons/bs";

const CashReport = () => {
  const [startDate, setStartDate] = useState(new Date(new Date().setMonth(new Date().getMonth() - 1)));
  const [endDate, setEndDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const mockTransactions = [
    {
      id: 1,
      date: "2024-01-15",
      description: "Salary Deposit",
      type: "credit",
      amount: 5000.00,
      balance: 5000.00
    },
    {
      id: 2,
      date: "2024-01-16",
      description: "Grocery Shopping",
      type: "debit",
      amount: 150.50,
      balance: 4849.50
    },
    {
      id: 3,
      date: "2024-01-17",
      description: "Online Transfer",
      type: "credit",
      amount: 1000.00,
      balance: 5849.50
    },
    {
      id: 4,
      date: "2024-01-18",
      description: "Utility Bill Payment",
      type: "debit",
      amount: 200.00,
      balance: 5649.50
    }
  ];

  const filteredTransactions = useMemo(() => {
    return mockTransactions
      .filter(transaction => {
        const transactionDate = parseISO(transaction.date);
        return (
          (!startDate || !isAfter(startDate, transactionDate)) &&
          (!endDate || !isAfter(transactionDate, endDate)) &&
          transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
  }, [mockTransactions, startDate, endDate, searchTerm]);

  const summaryStats = useMemo(() => {
    return filteredTransactions.reduce((acc, curr) => {
      if (curr.type === "credit") {
        acc.totalCredits += curr.amount;
      } else {
        acc.totalDebits += curr.amount;
      }
      return acc;
    }, { totalCredits: 0, totalDebits: 0 });
  }, [filteredTransactions]);

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 500);
  };

  const handleExport = () => {
    const csvContent = [
      ["Date", "Description", "Type", "Amount", "Balance"],
      ...filteredTransactions.map(t => [
        t.date,
        t.description,
        t.type,
        t.amount,
        t.balance
      ])
    ].map(row => row.join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "bank-statement.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className=" md:text-4xl font-extrabold tracking-tight text-gray-900 mb-8">Cash In Hand</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <h3 className="text-body font-body mb-2">Total Credits</h3>
            <p className="text-heading text-chart-2">${summaryStats.totalCredits.toFixed(2)}</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <h3 className="text-body font-body mb-2">Total Debits</h3>
            <p className="text-heading text-chart-1">${summaryStats.totalDebits.toFixed(2)}</p>
          </div>
          <div className="bg-card p-4 rounded-lg shadow-sm">
            <h3 className="text-body font-body mb-2">Cash at Counter</h3>
            <p className="text-heading text-primary">
              ${(summaryStats.totalCredits - summaryStats.totalDebits).toFixed(2)}
            </p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-lg shadow-sm mb-6">
          <div className="flex flex-col md:flex-row justify-between gap-4 mb-6">
            <div className="w-full md:w-auto">
              <DatePicker
                selected={startDate}
                onChange={handleDateChange}
                startDate={startDate}
                endDate={endDate}
                selectsRange
                className="w-full px-4 py-2 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:outline-none"
                dateFormat="yyyy-MM-dd"
                placeholderText="Select date range"
              />
            </div>
            <div className="relative w-full md:w-64">
              <input
                type="text"
                placeholder="Search transactions..."
                className="w-full px-4 py-2 pr-10 border border-input rounded-lg focus:ring-2 focus:ring-ring focus:outline-none"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FaSearch className="absolute right-3 top-3 text-accent" />
            </div>
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-opacity-90 transition-colors"
            >
              <FaFileDownload /> Export CSV
            </button>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <FaSpinner className="animate-spin text-4xl text-primary" />
            </div>
          ) : filteredTransactions.length === 0 ? (
            <div className="text-center py-12 text-accent">
              No transactions found for the selected criteria
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="px-4 py-3 text-left text-body font-body">Date</th>
                    <th className="px-4 py-3 text-left text-body font-body">Description</th>
                    <th className="px-4 py-3 text-left text-body font-body">Type</th>
                    <th className="px-4 py-3 text-right text-body font-body">Amount</th>
                    <th className="px-4 py-3 text-right text-body font-body">Balance</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map((transaction) => (
                    <tr
                      key={transaction.id}
                      className="border-b border-border hover:bg-secondary transition-colors"
                    >
                      <td className="px-4 py-3">{format(parseISO(transaction.date), "MMM dd, yyyy")}</td>
                      <td className="px-4 py-3">{transaction.description}</td>
                      <td className="px-4 py-3">
                        <span className="flex items-center gap-1">
                          {transaction.type === "credit" ? (
                            <BsArrowUp className="text-chart-2" />
                          ) : (
                            <BsArrowDown className="text-chart-1" />
                          )}
                          {transaction.type}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={transaction.type === "credit" ? "text-chart-2" : "text-chart-1"}>
                          ${transaction.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">${transaction.balance.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CashReport;