import React, { useState, useEffect, useMemo } from "react";
import { FiSearch, FiFilter, FiDownload, FiTrash2, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { format } from "date-fns";

const PurchaseBill = () => {
  const [reports, setReports] = useState([]);
  const [selectedReports, setSelectedReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    dateRange: { start: null, end: null }
  });

  const ITEMS_PER_PAGE = 10;

  // Mock data initialization
  useEffect(() => {
    const mockReports = Array.from({ length: 50 }, (_, index) => ({
      id: `REP${index + 1}`,
      title: `Report ${index + 1}`,
      date: new Date(2024, 0, index + 1),
      status: ["Active", "Completed", "Pending"][Math.floor(Math.random() * 3)],
      category: ["Financial", "Operations", "Marketing", "HR"][Math.floor(Math.random() * 4)],
      priority: ["High", "Medium", "Low"][Math.floor(Math.random() * 3)],
      author: [`John Doe`, "Jane Smith", "Mike Johnson"][Math.floor(Math.random() * 3)]
    }));
    setReports(mockReports);
  }, []);

  const filteredReports = useMemo(() => {
    return reports.filter(report => {
      const matchesSearch = Object.values(report).some(
        value => value.toString().toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilters =
        (!filters.status || report.status === filters.status) &&
        (!filters.category || report.category === filters.category) &&
        (!filters.priority || report.priority === filters.priority);

      return matchesSearch && matchesFilters;
    });
  }, [reports, searchTerm, filters]);

  const paginatedReports = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredReports.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredReports, currentPage]);

  const totalPages = Math.ceil(filteredReports.length / ITEMS_PER_PAGE);

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedReports(paginatedReports.map(report => report.id));
    } else {
      setSelectedReports([]);
    }
  };

  const handleSelectReport = (reportId) => {
    setSelectedReports(prev =>
      prev.includes(reportId)
        ? prev.filter(id => id !== reportId)
        : [...prev, reportId]
    );
  };

  const handleExport = () => {
    console.log("Exporting selected reports:", selectedReports);
  };

  const handleDelete = () => {
    console.log("Deleting selected reports:", selectedReports);
  };

  return (
    
    <div className="w-full bg-card p-6 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full md:w-96">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-accent" />
          <input
            type="text"
            placeholder="Search reports..."
            className="w-full pl-10 pr-4 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-4">
          <select
            className="border border-input rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            value={filters.status}
            onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Completed">Completed</option>
            <option value="Pending">Pending</option>
          </select>

          <select
            className="border border-input rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-ring"
            value={filters.priority}
            onChange={(e) => setFilters(prev => ({ ...prev, priority: e.target.value }))}
          >
            <option value="">All Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {selectedReports.length > 0 && (
        <div className="flex gap-4 mb-4">
          <button
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            <FiDownload /> Export Selected
          </button>
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90"
          >
            <FiTrash2 /> Delete Selected
          </button>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-secondary">
              <th className="p-4 text-left">
                <input
                  type="checkbox"
                  checked={selectedReports.length === paginatedReports.length}
                  onChange={handleSelectAll}
                  className="rounded border-input"
                />
              </th>
              <th className="p-4 text-left">ID</th>
              <th className="p-4 text-left">Title</th>
              <th className="p-4 text-left">Date</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Category</th>
              <th className="p-4 text-left">Priority</th>
              <th className="p-4 text-left">Author</th>
            </tr>
          </thead>
          <tbody>
            {paginatedReports.map((report) => (
              <tr
                key={report.id}
                className={`border-b border-border hover:bg-secondary/50 ${
                  selectedReports.includes(report.id) ? "bg-secondary/30" : ""
                }`}
              >
                <td className="p-4">
                  <input
                    type="checkbox"
                    checked={selectedReports.includes(report.id)}
                    onChange={() => handleSelectReport(report.id)}
                    className="rounded border-input"
                  />
                </td>
                <td className="p-4">{report.id}</td>
                <td className="p-4">{report.title}</td>
                <td className="p-4">{format(report.date, "MM/dd/yyyy")}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      report.status === "Active"
                        ? "bg-chart-2/20 text-chart-2"
                        : report.status === "Completed"
                        ? "bg-chart-1/20 text-chart-1"
                        : "bg-chart-4/20 text-chart-4"
                    }`}
                  >
                    {report.status}
                  </span>
                </td>
                <td className="p-4">{report.category}</td>
                <td className="p-4">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      report.priority === "High"
                        ? "bg-destructive/20 text-destructive"
                        : report.priority === "Medium"
                        ? "bg-chart-4/20 text-chart-4"
                        : "bg-chart-2/20 text-chart-2"
                    }`}
                  >
                    {report.priority}
                  </span>
                </td>
                <td className="p-4">{report.author}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-accent">
          Showing {((currentPage - 1) * ITEMS_PER_PAGE) + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredReports.length)} of {filteredReports.length} entries
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="p-2 border border-input rounded-md disabled:opacity-50"
          >
            <FiChevronLeft />
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="p-2 border border-input rounded-md disabled:opacity-50"
          >
            <FiChevronRight />
          </button>
        </div>
      </div>
    </div>
  
  );
};

export default PurchaseBill;