import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // Import useAuth

const Sidebar = () => {
  const { logout } = useAuth(); // Get logout function from AuthContext
  const navigate = useNavigate(); // Initialize navigate
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  const toggleDropdown = (dropdown) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const handleLogout = async () => {
    try {
      await logout(); // Call the logout function
      navigate("/login"); // Redirect to the login page
    } catch (error) {
      console.error("Logout error:", error);
    }
  };
  return (
    <div>
      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-screen w-64 bg-[#1d3557] shadow-lg z-50 transform lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 lg:static lg:h-screen lg:shadow-none lg:flex lg:flex-col`}
      >
        {/* Sidebar Header */}
        <div className="p-4 text-white text-center">
          <h1 className="text-lg font-bold">Supriya Dashboard</h1>
          {/* Current Date and Time */}
          <p className="text-sm mt-2">{currentDateTime.toLocaleString()}</p>
        </div>

        {/* Navigation */}
        <nav className="mt-4 flex-1">
          <NavItem to="/dashboard" icon="🏠" label="Dashboard" />
          <NavItem to="/parties" icon="🦸‍♂️" label="Parties" />
          <NavItem to="/items" icon="🚛" label="Items" />

          {/* Dropdowns */}
          <Dropdown
            icon="💵"
            label="Sale"
            isOpen={activeDropdown === "Sale"}
            toggle={() => toggleDropdown("Sale")}
            links={[
              { to: "/SaleForm", label: "Sale Invoice" },
              { to: "/Quotation", label: "Estimate/Quotation" },
              { to: "/payment-in", label: "Payment In" },
              { to: "/sale-order", label: "Sale Order" },
              // { to: "/delivery-chalan", label: "Delivery Chalan" },
              // { to: "/sales-return", label: "Sales Return/ Cr. Note" },
            ]}
          />
          <Dropdown
            icon="🛒"
            label="Purchase & Expense"
            isOpen={activeDropdown === "Purchase & Expense"}
            toggle={() => toggleDropdown("Purchase & Expense")}
            links={[
              { to: "/purchase-bills", label: "Purchase Bills" },
              { to: "/payment-out", label: "Payment Out" },
              { to: "/expense", label: "Expense" },
              // { to: "/purchase-order", label: "Purchase Order" },
              // { to: "/purchase-return", label: "Purchase Return/ Dr. Note" },
            ]}
          />
          <Dropdown
            icon="💰"
            label="Cash & Bank"
            isOpen={activeDropdown === "Cash & Bank"}
            toggle={() => toggleDropdown("Cash & Bank")}
            links={[
              { to: "/bank-account", label: "Bank Account" },
              { to: "/cash-in-hand", label: "Cash In Hand" },
              { to: "/cheque", label: "Cheque" },
            ]}
          />
          <NavItem to="/reports" icon="📈" label="Reports" />
          <Dropdown
            icon="👨‍🏭"
            label="Staff Management"
            isOpen={activeDropdown === "Staff Management"}
            toggle={() => toggleDropdown("Staff Management")}
            links={[
              { to: "/staffAttendance", label: "Attendance" },
              { to: "/staffSalary", label: "Salary Report" },
            ]}
          />
          <NavItem to="/users" icon="👥" label="Users" />
        </nav>

        {/* Auth Pages */}
        <div className="border-t border-gray-300">
          <h2 className="p-4 text-white">Auth Pages</h2>
          <NavItem to="/settings" icon="⚙️" label="Settings" />
          <NavItem
            icon="🚪"
            label="Sign Out"
            id="auth-action"
            onClick={handleLogout} // Use handleLogout
          />
        </div>
      </div>

      {/* Mobile Hamburger Button */}
      <button
        className="lg:hidden absolute bottom-4 left-4 text-2xl p-2 bg-[#1d3557] text-white rounded-md focus:outline-none z-50"
        onClick={toggleSidebar}
      >
        ☰
      </button>
    </div>
  );
};

const NavItem = ({ to, icon, label, id, onClick  }) => {
  const location = useLocation();
  const isActive = to ? location.pathname === to : false;
   // Handle clickable items that aren't links
   if (onClick) {
    return (
      <button
        onClick={onClick}
        className={`flex items-center px-4 py-2 transition text-white hover:bg-opacity-50 w-full text-left`}
        id={id}
      >
        <span className="mr-2">{icon}</span>
        {label}
      </button>
    );
  }

  return (
    <Link
    to={to}
    className={`flex items-center px-4 py-2 transition ${
      isActive ? "bg-opacity-75 text-white" : "text-white hover:bg-opacity-50"
    }`}
    id={id}
  >
    <span className="mr-2">{icon}</span>
    {label}
  </Link>
  );
};

const Dropdown = ({ icon, label, isOpen, toggle, links }) => (
  <div className="flex flex-col">
    <button
      type="button"
      className="flex items-center justify-between px-4 py-2 text-white hover:bg-opacity-75 transition"
      onClick={toggle}
    >
      <span className="flex items-center">
        <span className="mr-2">{icon}</span>
        {label}
      </span>
      <span>{isOpen ? "▲" : "▼"}</span>
    </button>
    <div className={`${isOpen ? "block" : "hidden"}`}>
      {links.map((link, index) => (
        <Link
          key={index}
          to={link.to}
          className="block px-4 py-2 text-white hover:bg-opacity-50 transition"
        >
          {link.label}
        </Link>
      ))}
    </div>
  </div>
);

export default Sidebar;
