import React, { useState } from 'react';

const AddPartyForm = ({ addParty, closeForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    address: '',
    email: '',
    phone: '',
    photo: null, // Photo will be handled as a file input
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle photo upload
  const handlePhotoChange = (e) => {
    setFormData({
      ...formData,
      photo: e.target.files[0],
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    addParty(formData);
    closeForm();
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-gray-600 bg-opacity-50">
      <div className="bg-white p-6 rounded-md w-96">
        <h2 className="text-xl font-semibold mb-4">Add New Party</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700">Party Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mt-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="amount" className="block text-gray-700">Amount</label>
            <input
              type="text"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mt-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="address" className="block text-gray-700">Address</label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mt-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mt-2"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="phone" className="block text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md mt-2"
              required
            />
          </div>
          

          <div className="mb-4">
            <label htmlFor="photo" className="block text-gray-700">Party Photo</label>
            <input
              type="file"
              id="photo"
              name="photo"
              onChange={handlePhotoChange}
              className="w-full px-4 py-2 border rounded-md mt-2"
            />
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={closeForm}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md"
            >
              Add Party
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPartyForm;
