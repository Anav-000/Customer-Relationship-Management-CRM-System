import React, { useState, useEffect } from "react";
import { FiTrash2, FiPlus } from "react-icons/fi";
import { format } from "date-fns";

const SalesOrderForm = () => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    contactNumber: "",
    billingAddress: "",
    orderDate: format(new Date(), "yyyy-MM-dd"),
    orderNumber: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    salesRepresentative: "",
    products: [
      {
        id: Date.now(),
        name: "",
        quantity: 1,
        unitPrice: 0,
        totalPrice: 0
      }
    ],
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0
  });

  const [errors, setErrors] = useState({});
  const [salesReps] = useState([
    "John Doe",
    "Jane Smith",
    "Mike Johnson",
    "Sarah Williams"
  ]);

  const [productsList] = useState([
    { id: 1, name: "Product A", price: 100 },
    { id: 2, name: "Product B", price: 200 },
    { id: 3, name: "Product C", price: 300 },
    { id: 4, name: "Product D", price: 400 }
  ]);

  useEffect(() => {
    calculateTotals();
  }, [formData.products, formData.discount]);

  const calculateTotals = () => {
    const subtotal = formData.products.reduce(
      (sum, product) => sum + product.totalPrice,
      0
    );
    const discountAmount = (subtotal * formData.discount) / 100;
    const taxAmount = ((subtotal - discountAmount) * 10) / 100; // 10% tax
    const total = subtotal - discountAmount + taxAmount;

    setFormData(prev => ({
      ...prev,
      subtotal,
      tax: taxAmount,
      total
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name, value);
  };

  const handleProductChange = (index, field, value) => {
    const updatedProducts = [...formData.products];
    updatedProducts[index][field] = value;

    if (field === "quantity" || field === "unitPrice") {
      updatedProducts[index].totalPrice =
        updatedProducts[index].quantity * updatedProducts[index].unitPrice;
    }

    setFormData(prev => ({ ...prev, products: updatedProducts }));
  };

  const addProduct = () => {
    setFormData(prev => ({
      ...prev,
      products: [
        ...prev.products,
        {
          id: Date.now(),
          name: "",
          quantity: 1,
          unitPrice: 0,
          totalPrice: 0
        }
      ]
    }));
  };

  const removeProduct = (index) => {
    if (formData.products.length > 1) {
      const updatedProducts = formData.products.filter((_, i) => i !== index);
      setFormData(prev => ({ ...prev, products: updatedProducts }));
    }
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "customerEmail":
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors.customerEmail = "Invalid email format";
        } else {
          delete newErrors.customerEmail;
        }
        break;
      case "contactNumber":
        const phoneRegex = /^\d{10}$/;
        if (!phoneRegex.test(value)) {
          newErrors.contactNumber = "Invalid phone number";
        } else {
          delete newErrors.contactNumber;
        }
        break;
      default:
        if (!value && name !== "discount") {
          newErrors[name] = "This field is required";
        } else {
          delete newErrors[name];
        }
    }

    setErrors(newErrors);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validate all fields
    let newErrors = {};
    if (!formData.customerName) newErrors.customerName = "Required";
    if (!formData.customerEmail) newErrors.customerEmail = "Required";
    if (!formData.contactNumber) newErrors.contactNumber = "Required";
    if (!formData.billingAddress) newErrors.billingAddress = "Required";
    if (!formData.salesRepresentative) newErrors.salesRepresentative = "Required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit form logic here
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-h-[96vh] bg-background p-6 overflow-auto   [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-track]:bg-gray-100   [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <div className="w-full mx-auto">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Customer Information */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Customer Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Customer Name</label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.customerName ? "border-red-500" : ""}`}
                />
                {errors.customerName && (
                  <p className="mt-1 text-sm text-red-500">{errors.customerName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.customerEmail ? "border-red-500" : ""}`}
                />
                {errors.customerEmail && (
                  <p className="mt-1 text-sm text-red-500">{errors.customerEmail}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Contact Number</label>
                <input
                  type="tel"
                  name="contactNumber"
                  value={formData.contactNumber}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.contactNumber ? "border-red-500" : ""}`}
                />
                {errors.contactNumber && (
                  <p className="mt-1 text-sm text-red-500">{errors.contactNumber}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Billing Address</label>
                <textarea
                  name="billingAddress"
                  value={formData.billingAddress}
                  onChange={handleInputChange}
                  rows="3"
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.billingAddress ? "border-red-500" : ""}`}
                />
                {errors.billingAddress && (
                  <p className="mt-1 text-sm text-red-500">{errors.billingAddress}</p>
                )}
              </div>
            </div>
          </div>

          {/* Order Details */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">Order Date</label>
                <input
                  type="date"
                  name="orderDate"
                  value={formData.orderDate}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Order Number</label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  readOnly
                  className="mt-1 block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Sales Representative</label>
                <select
                  name="salesRepresentative"
                  value={formData.salesRepresentative}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 ${errors.salesRepresentative ? "border-red-500" : ""}`}
                >
                  <option value="">Select Representative</option>
                  {salesReps.map(rep => (
                    <option key={rep} value={rep}>{rep}</option>
                  ))}
                </select>
                {errors.salesRepresentative && (
                  <p className="mt-1 text-sm text-red-500">{errors.salesRepresentative}</p>
                )}
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Products</h2>
              <button
                type="button"
                onClick={addProduct}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <FiPlus className="-ml-1 mr-2 h-5 w-5" />
                Add Product
              </button>
            </div>

            <div className="space-y-4">
              {formData.products.map((product, index) => (
                <div key={product.id} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <select
                      value={product.name}
                      onChange={(e) => handleProductChange(index, "name", e.target.value)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    >
                      <option value="">Select Product</option>
                      {productsList.map(p => (
                        <option key={p.id} value={p.name}>{p.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="w-24">
                    <input
                      type="number"
                      min="1"
                      value={product.quantity}
                      onChange={(e) => handleProductChange(index, "quantity", parseInt(e.target.value) || 0)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Qty"
                    />
                  </div>

                  <div className="w-32">
                    <input
                      type="number"
                      value={product.unitPrice}
                      onChange={(e) => handleProductChange(index, "unitPrice", parseFloat(e.target.value) || 0)}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                      placeholder="Unit Price"
                    />
                  </div>

                  <div className="w-32">
                    <input
                      type="number"
                      value={product.totalPrice}
                      readOnly
                      className="block w-full rounded-md border-gray-300 bg-gray-50 shadow-sm"
                      placeholder="Total"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => removeProduct(index)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <FiTrash2 className="h-5 w-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="bg-white shadow-sm rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Order Summary</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-medium">${formData.subtotal.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Discount (%):</span>
                <input
                  type="number"
                  name="discount"
                  min="0"
                  max="100"
                  value={formData.discount}
                  onChange={handleInputChange}
                  className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-between items-center">
                <span className="text-gray-600">Tax (10%):</span>
                <span className="font-medium">${formData.tax.toFixed(2)}</span>
              </div>

              <div className="flex justify-between items-center text-lg font-semibold">
                <span>Total:</span>
                <span>${formData.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Reset
            </button>
            <button
              type="submit"
              className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Create Order
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalesOrderForm;