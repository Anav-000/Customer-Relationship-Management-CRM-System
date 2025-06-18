import React, { useState } from "react";

function AddPartyForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    description: "",
  });

  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Example API endpoint
      const response = await fetch("https://api.example.com/parties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setSuccessMessage("Party added successfully!");
        setFormData({
          name: "",
          email: "",
          phone: "",
          address: "",
          description: "",
        });
      } else {
        console.error("Error adding party:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding party:", error);
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">Add New Party</h2>
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-2 rounded mb-4">
          {successMessage}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600">Party Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring focus:ring-blue-200 focus:outline-none"
            placeholder="Enter party name"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring focus:ring-blue-200 focus:outline-none"
            placeholder="Enter email address"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Phone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring focus:ring-blue-200 focus:outline-none"
            placeholder="Enter phone number"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Address</label>
          <textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring focus:ring-blue-200 focus:outline-none"
            placeholder="Enter address"
            rows="3"
            required
          ></textarea>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border rounded-lg text-gray-700 focus:ring focus:ring-blue-200 focus:outline-none"
            placeholder="Enter description"
            rows="3"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-200"
        >
          Add Party
        </button>
      </form>
    </div>
  );
}

export default AddPartyForm;
