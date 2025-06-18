import React, { useState } from "react";

const SaleComponent = () => {
  const [partyDetails, setPartyDetails] = useState({
    name: "",
    address: "",
    mobile: "",
    email: "",
    shopName: "",
    photo: null,
    searchParty: "",
    addParty: "",
  });

  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productList] = useState([
    { id: 1, name: "Product 1", price: 100 },
    { id: 2, name: "Product 2", price: 200 },
    { id: 3, name: "Product 3", price: 300 },
  ]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPartyDetails({ ...partyDetails, [name]: value });
  };

  const handleProductSelect = (product) => {
    setSelectedProducts((prev) => [...prev, product]);
  };

  const handleSubmit = () => {
    console.log("Final Bill Generated", selectedProducts);
    // You can implement logic to generate the final bill here
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-2xl font-semibold mb-4">Sale Component</h2>
      <div className="space-y-4">
        {/* Party Details Form */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={partyDetails.name}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              id="address"
              type="text"
              name="address"
              value={partyDetails.address}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-gray-700">Mobile</label>
            <input
              id="mobile"
              type="text"
              name="mobile"
              value={partyDetails.mobile}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              name="email"
              value={partyDetails.email}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="shopName" className="block text-sm font-medium text-gray-700">Shop Name</label>
            <input
              id="shopName"
              type="text"
              name="shopName"
              value={partyDetails.shopName}
              onChange={handleInputChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div>
            <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Upload Photo</label>
            <input
              id="photo"
              type="file"
              name="photo"
              onChange={(e) => setPartyDetails({ ...partyDetails, photo: e.target.files[0] })}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Product Search and Table */}
        <div className="mt-6">
          <input
            type="text"
            name="searchParty"
            placeholder="Search Party"
            value={partyDetails.searchParty}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          />
          <button
            onClick={() => setPartyDetails({ ...partyDetails, addParty: partyDetails.searchParty })}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
          >
            Add Party
          </button>
        </div>

        {/* Product Selection Table */}
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr>
                <th className="px-4 py-2 text-left">Product Name</th>
                <th className="px-4 py-2 text-left">Price</th>
                <th className="px-4 py-2 text-left">Select</th>
              </tr>
            </thead>
            <tbody>
              {productList.map((product) => (
                <tr key={product.id}>
                  <td className="px-4 py-2">{product.name}</td>
                  <td className="px-4 py-2">{product.price}</td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => handleProductSelect(product)}
                      className="bg-green-500 text-white px-4 py-1 rounded-md"
                    >
                      Select
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Products Summary */}
        <div className="mt-6">
          <h3 className="text-xl font-semibold">Selected Products:</h3>
          <ul className="space-y-2 mt-2">
            {selectedProducts.map((product, index) => (
              <li key={index} className="flex justify-between">
                <span>{product.name}</span>
                <span>{product.price}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Final Submit Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-indigo-600 text-white px-6 py-3 rounded-md"
          >
            Generate Bill
          </button>
        </div>
      </div>
    </div>
  );
};

export default SaleComponent;
