import React, { useState, useEffect } from 'react';
import { Trash2, Edit } from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function SaleForm() {
  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    date: new Date().toISOString().split('T')[0],
    paidAmount: 0,
    discount: 0,
  });

  const [items, setItems] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categories, setCategories] = useState([]);  // Categories state
  const [selectedCategory, setSelectedCategory] = useState('');  // Selected category
  const [newItem, setNewItem] = useState({
    product: '',
    quantity: 1,
    amount: 0,
  });
  const [editingItemId, setEditingItemId] = useState(null);
  const [alertMessage, setAlertMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Pagination state
  const [itemsPerPage, setItemsPerPage] = useState(10); // Items per page state

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const response = await fetch('http://localhost:5000/data'); // Your API endpoint
        const data = await response.json();
        setItems(data);
        setFilteredProducts(data); // Initially show all items

        // Extract categories from products
        const uniqueCategories = [...new Set(data.map((product) => product.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchItems();

    const persistedFormData = JSON.parse(localStorage.getItem('formData'));
    const persistedItems = JSON.parse(localStorage.getItem('items'));
    if (persistedFormData) {
      setFormData(persistedFormData);
    }
    if (persistedItems) {
      setItems(persistedItems);
      setFilteredProducts(persistedItems); // Persisted items should also be filtered
    }
  }, []);

  // const handleItemChange = (e) => {
  //   const { name, value } = e.target;
  //   setNewItem((prev) => ({
  //     ...prev,
  //     [name]: value,
  //   }));
  // };

  const handleEditItem = (item) => {
    // Set the form fields to the values of the item being edited
    setNewItem({
      product: item.product,
      quantity: item.quantity,
      amount: item.amount,
    });

    // Set the editing item ID to keep track of the item we're editing
    setEditingItemId(item.id);
  };


  // const handleAddItem = () => {
  //   if (!newItem.product || newItem.quantity <= 0 || newItem.amount <= 0) {
  //     alert('Please provide valid product details.');
  //     return;
  //   }

  //   const itemToAdd = {
  //     id: editingItemId || Date.now(),
  //     ...newItem,
  //     total: newItem.quantity * newItem.amount,
  //   };

  //   if (editingItemId) {
  //     setItems(items.map((item) => (item.id === editingItemId ? itemToAdd : item)));
  //     setEditingItemId(null);
  //   } else {
  //     setItems([...items, itemToAdd]);
  //   }

  //   setNewItem({ product: '', quantity: 1, amount: 0 });
  // };

  const handleDeleteItem = (id) => {
    setItems(items.filter((item) => item.id !== id));
  };

  // Filter products by search term and selected category
  const filteredSuggestions = searchTerm
    ? filteredProducts.filter((item) => item.product?.toLowerCase().includes(searchTerm.toLowerCase()))
    : filteredProducts;

  const filteredByCategory = selectedCategory
    ? filteredSuggestions.filter((item) => item.category === selectedCategory)
    : filteredSuggestions;

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredByCategory.slice(indexOfFirstItem, indexOfLastItem);

  const totalPages = Math.ceil(filteredByCategory.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page when items per page is changed
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const discountAmount = (formData.discount / 100) * subtotal;
  const subtotalAfterDiscount = subtotal - discountAmount;
  const cgstAmount = (9 / 100) * subtotalAfterDiscount;
  const sgstAmount = (9 / 100) * subtotalAfterDiscount;
  const grandTotal = subtotalAfterDiscount + cgstAmount + sgstAmount;
  const balanceAmount = grandTotal - formData.paidAmount;
  const refundAmount = balanceAmount < 0 ? Math.abs(balanceAmount) : 0;

  const handleFinalSubmit = () => {
    const finalData = {
      customer: {
        name: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        date: formData.date,
      },
      items,
      calculations: {
        subtotal,
        discountAmount,
        subtotalAfterDiscount,
        cgstAmount,
        sgstAmount,
        grandTotal,
        paidAmount: formData.paidAmount,
        balanceAmount: balanceAmount > 0 ? balanceAmount : 0,
        refundAmount,
      },
    };
    console.log('Final submission:', finalData);
    setAlertMessage('Sale submitted successfully!');
    setTimeout(() => setAlertMessage(''), 3000);

    localStorage.setItem('formData', JSON.stringify(formData));
    localStorage.setItem('items', JSON.stringify(items));
  };

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text('Invoice', 20, 20);
    doc.text(`Customer: ${formData.customerName}`, 20, 30);
    doc.text(`Date: ${formData.date}`, 20, 40);

    let yOffset = 50;
    items.forEach((item) => {
      doc.text(`${item.product} x ${item.quantity}`, 20, yOffset);
      doc.text(`$${item.amount} each`, 100, yOffset);
      doc.text(`Total: $${item.total}`, 150, yOffset);
      yOffset += 10;
    });

    doc.text(`Subtotal: $${subtotalAfterDiscount.toFixed(2)}`, 20, yOffset);
    doc.text(`Discount: -$${discountAmount.toFixed(2)}`, 20, yOffset + 10);
    doc.text(`Subtotal after Discount: $${subtotalAfterDiscount.toFixed(2)}`, 20, yOffset + 20);
    doc.text(`CGST: $${cgstAmount.toFixed(2)}`, 20, yOffset + 30);
    doc.text(`SGST: $${sgstAmount.toFixed(2)}`, 20, yOffset + 40);
    doc.text(`Grand Total: $${grandTotal.toFixed(2)}`, 20, yOffset + 50);
    doc.text(`Paid Amount: $${formData.paidAmount.toFixed(2)}`, 20, yOffset + 60);
    doc.text(`Balance: $${balanceAmount.toFixed(2)}`, 20, yOffset + 70);

    doc.save('invoice.pdf');
  };

  return (
    <div className="container mx-auto p-6 bg-white rounded-xl shadow-xl">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6 text-center">New Sale Entry</h2>

      {alertMessage && (
        <div className="mb-4 p-4 bg-green-100 text-green-800 border border-green-300 rounded-md">
          {alertMessage}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="tel"
            name="searchByPhone"
            placeholder='Search By Phone'
            value={formData.search}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"

          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Customer Name</label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"

          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            required
          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
          <input
            type="text"
            name="customerAddress"
            value={formData.customerAddress}
            onChange={(e) => setFormData({ ...formData, customerAddress: e.target.value })}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"

          />
        </div>
        <div className="relative">
          <label className="block text-sm font-medium text-gray-700 mb-1">GST No</label>
          <input
            type="number"
            name="gstNo"
            value={formData.gst}
            onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
            className="w-full rounded-md border border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"

          />
        </div>


      </div>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        {/* Category Filter */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Category</label>
          <select
            value={selectedCategory}
            onChange={handleCategoryChange}
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((category, index) => (
              <option key={index} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Search Bar */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Search Products</label>
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search by product name"
          />
        </div>

        {/* Pagination */}
        <div className="mb-4 flex justify-between items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Items per page</label>
            <select
              value={itemsPerPage}
              onChange={handleItemsPerPageChange}
              className="p-2 rounded-md border border-gray-300 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value={10}>10</option>
              <option value={100}>100</option>
              <option value={500}>500</option>
              <option value={filteredByCategory.length}>All</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="mr-2 p-2 rounded-md bg-gray-300 disabled:bg-gray-100"
            >
              Previous
            </button>
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="p-2 rounded-md bg-gray-300 disabled:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      {/* Products Table */}
      <div className="overflow-hidden mb-6 flex">
        <table className="table-auto w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2">{item.product}</td>
                <td className="px-4 py-2">{item.category}</td>
                <td className="px-4 py-2">{item.quantity}</td>
                <td className="px-4 py-2">₹{item.total}</td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => handleEditItem(item)}
                    className="mr-2 text-yellow-500 hover:text-yellow-700"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* selected items table */}
        <table className="table-auto w-full text-sm text-left text-gray-600">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Product</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Quantity</th>
              <th className="px-4 py-2">Amount</th>
              <th className="px-4 py-2">Total</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item) => (
              <tr key={item.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2"></td>
                <td className="px-4 py-2">₹</td>
                <td className="px-4 py-2">₹</td>
                <td className="px-4 py-2">

                  <button
                    onClick={() => handleEditItem(item)}
                    className="mr-2 text-yellow-500 hover:text-yellow-700"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Submit Final Form */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
        <div className="mb-6">
          <button
            onClick={generatePDF}
            className="w-40 bg-gray-500 text-white p-2 rounded-md"
          >
            Generate Invoice PDF
          </button>
        </div>
        <div className="mb-6">
          <button
            onClick={handleFinalSubmit}
            className="w-40 bg-green-500 text-white p-2 rounded-md"
          >
            Final Submit
          </button>
        </div>


      </div>
    </div>
  );
}
