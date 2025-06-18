// import * as React from 'react';
import React, { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
// import { jsPDF } from "jspdf";
import axios from "axios";

// import jsPDFInvoiceTemplate from "jspdf-invoice-template";
import jsPDFInvoiceTemplate, { OutputType } from "jspdf-invoice-template";


export default function SaleForm() {
  const [formData, setFormData] = useState({
    customerName: "",
    email: "",
    phone: "",
    address: "",
    companyName: "",
    gstNo: "",
    date: new Date().toISOString().split("T")[0],
    paidAmount: "0", // Initialize as string
    discount: "0", // Initialize as string
  });

  const [items, setItems] = useState([]);
  // const [vendorData, setVendorData] = useState([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showNewCustomerModal, setShowNewCustomerModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(100);
  const [alertMessage, setAlertMessage] = useState("");
  const [showPopup, setShowPopup] = useState(false); // For showing the popup form
  const [transactionData, setTransactionData] = useState({
    transactionType: "Cash",
    paymentReceived: "0", // Initialize as string
    advanceAmount: "0", // Initialize as string
    paymentType: "Cash",
    transactionStatus: "Pending",
  });

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch("http://localhost:5000/data");
        const data = await response.json();
        setItems(data);
        setFilteredProducts(data);

        const uniqueCategories = [
          ...new Set(data.map((product) => product.Category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchItems();
  }, []);

  const [vendorData, setVendorData] = useState([]);

  // Fetch vendor details from your API
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/venders"); // Your API endpoint
        const data = await response.json();
        setVendorData(data); // Set vendor data fetched from API
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchVendors();
  }, []);

  const handlePhoneChange = (event, value) => {
    // Update the formData with selected vendor's details
    setFormData((prevData) => ({
      ...prevData,
      phone: value?.phone || "", // If a vendor is selected, use their phone number
      customerName: value?.Name || "", // Autofill customer name
      email: value?.Email || "", // Autofill email
      address: value?.Address || "", // Autofill address
      companyName: value?.CompanyName || "", // Autofill gst
      gstNo: value?.Gstin || "", // Autofill company address
    }));
  };

  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredSuggestions = searchTerm
    ? filteredProducts.filter(
        (item) =>
          item.ProductName &&
          item.ProductName.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : filteredProducts;

  const filteredByCategory = selectedCategory
    ? filteredSuggestions.filter((item) => item.Category === selectedCategory)
    : filteredSuggestions;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredByCategory.slice(
    indexOfFirstItem,
    indexOfLastItem
  );

  const totalPages = Math.ceil(filteredByCategory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const addToCart = (item) => {
    const quantity = prompt(`Enter quantity for ${item.ProductName}:`);

    if (quantity && !isNaN(quantity) && quantity > 0) {
      const newQuantity = Number(quantity);
      const price = parseFloat(item.MinSellPrice);

      setSelectedItems((prevItems) => {
        const existingItemIndex = prevItems.findIndex(
          (cartItem) => cartItem.Sl === item.Sl
        );

        if (existingItemIndex !== -1) {
          return prevItems.map((cartItem) => {
            if (cartItem.Sl === item.Sl) {
              return {
                ...cartItem,
                quantity: cartItem.quantity + newQuantity,
                MinSellPrice: price, // Ensure price is stored as number
                total: (cartItem.quantity + newQuantity) * price,
              };
            }
            return cartItem;
          });
        } else {
          return [
            ...prevItems,
            {
              ...item,
              MinSellPrice: price, // Convert to number here
              quantity: newQuantity,
              total: newQuantity * price,
            },
          ];
        }
      });
    } else {
      alert("Please enter a valid quantity.");
    }
  };

  // Fetch company data from your API
  async function getCompanyDetails() {
    const response = await fetch("http://localhost:5000/company");
    const companyData = await response.json();
    return companyData;
  }
  // Function to convert company logo buffer to image data
  async function loadImageFromBuffer(buffer) {
    const imageBlob = new Blob([buffer], { type: "image/jpeg" });
    return URL.createObjectURL(imageBlob);
  }

  // PDF Generation Function
  async function generateInvoice(invoiceID) {
    try {
        // Fetch data from APIs
        const companyRes = await axios.get("http://localhost:5000/company");
        const invoiceRes = await axios.get(`http://localhost:5000/api/customer/transection`);
        const itemsRes = await axios.get(`http://localhost:5000/api/customer/invoice/items`);

        const company = companyRes.data[0]; // Assuming single company
        const invoiceData = invoiceRes.data.find(inv => inv.invoiceID === invoiceID);
        const items = itemsRes.data.filter(item => item.invoiceID === invoiceID);

        if (!invoiceData) {
            console.error("Invoice not found!");
            return;
        }

        // Construct the invoice props
        const props = {
            outputType: OutputType.Save,
            fileName: `Invoice_${invoiceData.invoiceID}`,
            orientationLandscape: false,
            compress: true,
            logo: {
                src: "", // If your company logo is a base64 string, you can convert it
                type: 'PNG',
                width: 50,
                height: 25,
                margin: { top: 5, left: 5 }
            },
            business: {
                name: company.name,
                address: `${company.address}, ${company.city}`,
                state: `${company.state}, ${company.zip}`, 
                country: `${company.Country}`,
                phone: company.phone,
                email: company.email,
                website: "" || company.website,
            },
            contact: {
                label: "Invoice issued for:",
                name: invoiceData.customerName,
                address: invoiceData.Address,
                phone: invoiceData.Phone,
                email: invoiceData.Email,
            },
            invoice: {
                label: "Invoice #: ",
                num: invoiceData.invoiceID,
                invDate: `Payment Date: ${new Date(invoiceData.Date).toLocaleDateString()}`,
                invGenDate: `Invoice Date: ${new Date().toLocaleDateString()}`,
                header: [
                    { title: "#", style: { width: 10 } },
                    { title: "Product", style: { width: 30 } },
                    { title: "Category", style: { width: 30 } },
                    { title: "Quantity" },
                    { title: "Rate" },
                    { title: "Total" }
                ],
                table: items.map((item, index) => [
                    index + 1,
                    item.ProductName,
                    item.Category,
                    item.Quantity,
                    item.SalePrice,
                    item.Total
                ]),
                additionalRows: [
                    { col1: "Subtotal:", col2: invoiceData.TotalAmount, col3: "INR" },
                    { col1: "CGST:", col2: `${invoiceData.Cgst}%`, col3: "INR" },
                    { col1: "SGST:", col2: `${invoiceData.Sgst}%`, col3: "INR" },
                    { col1: "Total GST:", col2: invoiceData.totalGst, col3: "INR" },
                    { col1: "Grand Total:", col2: invoiceData.TotalAmount, col3: "INR" },
                    { col1: "Paid:", col2: invoiceData.PaidAmount, col3: "INR" },
                    { col1: "Balance:", col2: invoiceData.BalanceAmount, col3: "INR" },
                ],
                invDescLabel: "Invoice Note",
                invDesc: "Thank you for your business!",
            },
            footer: {
                text: "This is a system-generated invoice and does not require a signature."
            }
        };

        // Generate PDF
        jsPDFInvoiceTemplate(props);
        console.log(`Invoice_${invoiceData.invoiceID}.pdf has been generated.`);
    } catch (error) {
        console.error("Error generating invoice:", error.message);
    }
}

// generateInvoice(12);

  const handleDeleteItem = (id) => {
    setSelectedItems(selectedItems.filter((item) => item.Sl !== id));
  };

  // Calculations
  const subtotal = selectedItems.reduce((sum, item) => sum + item.total, 0);
  const cgstAmount = (9 / 100) * subtotal;
  const sgstAmount = (9 / 100) * subtotal;
  const igstAmount = (9 / 100) * subtotal;
  const totalGST = cgstAmount + sgstAmount + igstAmount;

  const total = subtotal + totalGST;
  const grandTotal =
    total - transactionData.advanceAmount - transactionData.paymentReceived;

  const refundAmount =
    transactionData.advanceAmount + transactionData.paymentReceived > total
      ? Math.abs(grandTotal)
      : 0;

  const handleFinalSubmit = () => {
    if (!formData.customerName || !formData.phone) {
      alert("Please fill in required customer details");
      return;
    }
    if (selectedItems.length === 0) {
      alert("Please add items to the cart");
      return;
    }
    setShowPopup(true);
  };
  const handleSubmitInvoice = async () => {
    const items = selectedItems.map((item) => ({
      productName: item.ProductName,
      category: item.Category,
      quantity: item.quantity,
      salePrice: item.MinSellPrice,
      total: item.total,
      totalDiscountAmount: 0,
    }));

    const invoiceData = {
      customerName: formData.customerName,
      phone: formData.phone,
      email: formData.email,
      address: formData.address,
      companyName: formData.companyName,
      gstNo: formData.gstNo,
      date: formData.date,
      discountAmount: transactionData.advanceAmount,
      cgst: 9,
      sgst: 9,
      igst: 0,
      totalGst: totalGST,
      totalAmount: total,
      paidAmount: transactionData.paymentReceived,
      balanceAmount: grandTotal,
      transactionType: transactionData.transactionType,
      paymentType: transactionData.paymentType,
      items: items,
    };
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/api/create_invoice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(invoiceData),
      });

      const text = await response.text();
      const result = text ? JSON.parse(text) : {};

      if (!response.ok) {
        const errorMessage =
          result.message || `HTTP error! status: ${response.status}`;
        throw new Error(errorMessage);
      }

      await generateInvoice();
      alert("Invoice created successfully!");
      setShowPopup(false);

      // Optional: Reset form after successful submission
      setFormData({
        customerName: "",
        email: "",
        phone: "",
        date: new Date().toISOString().split("T")[0],
        paidAmount: 0,
        discount: 0,
      });
      setSelectedItems([]);
    } catch (error) {
      console.error("Error creating invoice:", error);
      alert(`Error creating invoice: ${error.message}`);
      setShowPopup(false);
    } finally {
      setIsSubmitting(false);
    }
  };
  // method of adding new customer
  const handleAddCustomer = async () => {
    if (!formData.customerName || !formData.phone) {
      alert("Please fill in required fields: Name and Phone");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/venders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          Name: formData.customerName,
          phone: formData.phone,
          Email: formData.email,
          Address: formData.address,
          CompanyName: formData.companyName,
          Gstin: formData.gstNo,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save customer");
      }

      // Refresh vendor list
      const vendorsResponse = await fetch("http://localhost:5000/api/venders");
      const vendorsData = await vendorsResponse.json();
      setVendorData(vendorsData);

      setShowNewCustomerModal(false);
      alert("Customer added successfully!");
    } catch (error) {
      console.error("Error saving customer:", error);
      alert("Error saving customer: " + error.message);
    }
  };
  return (
    <div className="max-h-[96vh] bg-background p-6 overflow-auto   [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-track]:bg-gray-100   [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <h2 className="text-3xl font-semibold text-gray-800 mb-2 text-center mt-0">
        New Sale Entry
      </h2>

      {alertMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-md">
          {alertMessage}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Search By Phone
          </label>

          <Autocomplete
            value={vendorData.find((v) => v.phone === formData.phone) || null}
            options={vendorData}
            getOptionLabel={(option) =>
              `${option.phone || ""}${
                option.CompanyName ? ` - ${option.CompanyName}` : ""
              }`
            }
            onChange={handlePhoneChange}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Customer by Phone"
                // Add empty string fallback for initial render
                value={formData.phone || ""}
              />
            )}
            isOptionEqualToValue={(option, value) =>
              option.phone === value?.phone
            }
            renderOption={(props, option) => (
              <li {...props} key={option.Sl}>
                {option.Name} - {option.phone}
              </li>
            )}
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Customer Name
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={(e) =>
              setFormData({ ...formData, customerName: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={(e) =>
              setFormData({ ...formData, address: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            GST No
          </label>
          <input
            type="text"
            name="gstNo"
            value={formData.gstNo}
            onChange={(e) =>
              setFormData({ ...formData, gstNo: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>

        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Company Name
          </label>
          <input
            type="text"
            name="companyName"
            value={formData.companyName}
            onChange={(e) =>
              setFormData({ ...formData, companyName: e.target.value })
            }
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
          />
        </div>
        <div className="relative flex gap-2">
          <button
            onClick={() => setShowNewCustomerModal(true)}
            className="bg-blue-500 text-white px-4 py-2 rounded h-fit mt-auto"
          >
            New Customer
          </button>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <input
          type="text"
          placeholder="Search Products"
          value={searchTerm}
          onChange={handleSearchChange}
          className="p-2 border rounded"
        />
        <select
          value={transactionData.paymentType}
          onChange={(e) =>
            setTransactionData({
              ...transactionData,
              paymentType: e.target.value,
            })
          }
          className="w-full p-2 border rounded"
        >
          <option value="Cash">Cash</option>
          <option value="Card">Card</option>
          <option value="Online">Online</option>
        </select>
      </div>
      <div className="flex max-h-[57vh] overflow-scroll">
        <table className="table-auto w-full mb-6 border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Sale Price</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((item) => (
              <tr key={item.Sl} className="[&>td]:p-1 [&>td]:h-1">
                <td>{item.ProductName}</td>
                <td>{item.Category}</td>
                <td>₹{item.MinSellPrice}</td>
                <td>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                  >
                    Add to Cart
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <table className="w-full mb-6 border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="border p-2">Product</th>
              <th className="border p-2">Quantity</th>
              <th className="border p-2">Total</th>
              <th className="border p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {selectedItems.map((item) => (
              <tr key={item.Sl}>
                <td className="border p-1 h-1">{item.ProductName}</td>
                <td className="border p-1 h-1">{item.quantity}</td>
                <td className="border p-1 h-1">₹{item.total}</td>
                <td className="border p-1 h-1">
                  <button
                    onClick={() => handleDeleteItem(item.Sl)}
                    className="bg-red-500 text-white px-1 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-4 mb-6">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
          className="p-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>

        <div className="flex gap-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => setCurrentPage(index + 1)}
              className={`p-2 rounded ${
                currentPage === index + 1
                  ? "bg-blue-500 text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          ))}
        </div>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
          className="p-2 bg-gray-200 text-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Final Submit Button */}
      <button
        onClick={handleFinalSubmit}
        className="bg-green-500 text-white px-4 py-2 rounded"
      >
        Final Submit
      </button>
      <button onClick={generateInvoice} className="bg-blue-500 text-white px-4 py-2 rounded">
  Download Invoice
</button>

      {/* popup form to add new customer */}
      {showNewCustomerModal && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Customer</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name *
                </label>
                <input
                  type="text"
                  value={formData.customerName}
                  onChange={(e) =>
                    setFormData({ ...formData, customerName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone *
                </label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Address
                </label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) =>
                    setFormData({ ...formData, address: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Company Name
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  GST No
                </label>
                <input
                  type="text"
                  value={formData.gstNo}
                  onChange={(e) =>
                    setFormData({ ...formData, gstNo: e.target.value })
                  }
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <button
                onClick={() => setShowNewCustomerModal(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCustomer}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Save Customer
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Popup Form (Modal) */}
      {showPopup && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-500 bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-96">
            <h3 className="text-xl font-semibold mb-4">Transaction Form</h3>

            <div className="mb-4">
              <label className="block text-gray-700">Transaction Type</label>
              <select
                value={transactionData.transactionType}
                onChange={(e) =>
                  setTransactionData({
                    ...transactionData,
                    transactionType: e.target.value,
                  })
                }
                className="w-full p-2 border rounded"
              >
                <option value="">Select Type</option>
                <option value="Cash">Cash</option>
                <option value="Credit">Credit</option>
              </select>
            </div>
            {/* Summary Section */}
            <div className="summary-section border-t mt-4 pt-4">
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Sub Total:</span>
                <span>₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">CGST:</span>
                <span>₹{cgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">SGST:</span>
                <span>₹{sgstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">IGST:</span>
                <span>₹{igstAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Total GST:</span>
                <span>₹{totalGST.toFixed(2)}</span>
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Payment Type</label>
                <select
                  value={transactionData.transactionType}
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      transactionType: e.target.value,
                    })
                  }
                  className="w-full p-2 border rounded"
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit">Credit</option>
                </select>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Payment Received:</span>
                {/* <input
                  type="number"
                  value={transactionData.paymentReceived || ""}
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      paymentReceived: Number(e.target.value),
                    })
                  }
                  className="border rounded w-24"
                /> */}

                <input
                  type="number"
                  value={transactionData.paymentReceived?.toString() || "0"} // Ensure string value
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      paymentReceived: Number(e.target.value) || 0,
                    })
                  }
                  className="border rounded w-24"
                />
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Discount:</span>
                {/* <input
                  type="number"
                  value={transactionData.advanceAmount || ""}
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      advanceAmount: Number(e.target.value),
                    })
                  }
                  className="border rounded w-24"
                /> */}
                <input
                  type="number"
                  value={transactionData.advanceAmount?.toString() || "0"} // Ensure string value
                  onChange={(e) =>
                    setTransactionData({
                      ...transactionData,
                      advanceAmount: Number(e.target.value) || 0,
                    })
                  }
                  className="border rounded w-24"
                />
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="font-semibold">Total:</span>
                <span>₹{total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center font-bold text-lg">
                <span>Grand Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
            </div>

            {/* Refundable Amount */}
            <div className="mb-4">
              <label className="block text-gray-700">Refundable Amount</label>
              <input
                type="number"
                value={refundAmount}
                readOnly
                className="w-full p-2 border rounded bg-gray-100"
              />
            </div>

            <div className="flex justify-between">
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitInvoice}
                disabled={isSubmitting}
                // className="bg-blue-500 text-white px-4 py-2 rounded"
                className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
