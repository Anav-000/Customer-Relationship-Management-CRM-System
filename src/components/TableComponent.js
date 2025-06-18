import React, { useState, useEffect } from "react";

const TableComponent = () => {
  const [data, setData] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Default to 10 items per page

  const [editItem, setEditItem] = useState(null);
  const [newItem, setNewItem] = useState({
    ProductName: "",
    Category: "",
    Quantity: "",
    purchase_rate: "",
    wholesale_price: "",
    min_wholesale_qty: "",
    itm_location: "",
    disc_per: "",
    disc_amt: "",
  });
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false); // State for showing edit form
  // const itemsPerPage = 10;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/data");
        const jsonData = await response.json();
        setData(jsonData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const startIndex = (currentPage - 1) * itemsPerPage;

  const filteredData = Array.isArray(data)
    ? data.filter(
        (item) =>
          (item.ProductName || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (item.Category || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (item.itm_location || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
      )
    : [];

  const currentData = filteredData.slice(startIndex, startIndex + itemsPerPage);

  const handleEdit = (item) => {
    setEditItem({ ...item });
    setShowEditForm(true); // Show the edit form when editing an item
  };

  const handleSave = async () => {
    if (!editItem?.Sl) {
      alert("Invalid item selected for editing.");
      return;
    }
  
    console.log("Sending payload:", JSON.stringify(editItem));
  
    try {
      const response = await fetch(`http://localhost:5000/data/${editItem.Sl}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editItem), // Ensure the structure matches the backend
      });
  
      if (response.ok) {
        const updatedProduct = await response.json();
        console.log("Updated Product:", updatedProduct);
  
        setData((prevData) =>
          prevData.map((item) =>
            item.Sl === updatedProduct.updatedProduct.Sl
              ? updatedProduct.updatedProduct
              : item
          )
        );
        setShowEditForm(false);
      } else {
        const errorText = await response.text();
        console.error("Server Response Error:", errorText);
        alert("Failed to update product.");
      }
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };
  

  const handleAddItem = async () => {
    if (
      !newItem.ProductName ||
      isNaN(newItem.Quantity) ||
      newItem.Quantity < 0
    ) {
      alert("Please enter valid values.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        const addedItem = await response.json();
        setData((prevData) => [...prevData, addedItem]);
        setNewItem({
          ProductName: "",
          Category: "",
          Quantity: "",
          ManufacturePrice: "",
          WholeSalePrice: "",
          WholeSaleQuantity: "",
          StoreLocation: "",
        });
        setShowAddForm(false);
      } else {
        alert("Failed to 0roduct.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
    }
  };

  // Handle delete product
  const handleDelete = async (id) => {
    if (!id) {
      console.error("ID is missing.");
      return;
    }

    // Ask for confirmation before deleting
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );

    if (!isConfirmed) {
      // If the user clicks "Cancel", do not proceed with the delete
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/data/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove the deleted product from the state
        setData((prevData) => prevData.filter((item) => item.Sl !== id));
        console.log("Product deleted successfully.");
      } else {
        console.log("Product not found.");
      }
    } catch (error) {
      console.error("Error during delete:", error);
    }
  };

  return (
    <div className="max-h-[96vh] bg-background p-6 overflow-auto   [&::-webkit-scrollbar]:w-2  [&::-webkit-scrollbar-track]:bg-gray-100   [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Search"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 w-1/4"
        />
        <button
          onClick={() => setShowAddForm(true)}
          className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded mt-4"
        >
          Add new product
        </button>
      </div>
      {/* Edit Form */}
      {showEditForm && editItem && (
        <div className="mb-4 bg-gray-100 p-4 rounded shadow">
          <h2 className="text-xl font-bold mb-2">Edit Item</h2>
          <form>
            <input
              type="text"
              placeholder="Product Name"
              value={editItem.ProductName}
              onChange={(e) =>
                setEditItem({ ...editItem, ProductName: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="text"
              placeholder="Category"
              value={editItem.Category}
              onChange={(e) =>
                setEditItem({ ...editItem, Category: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={editItem.Quantity}
              onChange={(e) =>
                setEditItem({ ...editItem, Quantity: parseInt(e.target.value) })
              }
              className="w-full mb-2 p-2 border rounded"
            />
            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowEditForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mx-auto px-4 max-h-screen overflow-auto">
        
        <table className="min-w-full divide-y divide-gray-200">
          <thead>
            <tr>
              {/* <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Select</th> */}
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Sl
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Qty
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Wholesale Rate
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Min Wholesale Qty
              </th>
              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Itm Location
              </th>

              <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Record
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentData.map((item, index) => (
              <tr key={item.id}>
                {/* <td className="px-5 py-3 whitespace-nowrap">
                                    <input
                                    type='checkbox'/>
                                </td> */}
                <td className="px-5 py-3 whitespace-nowrap">{item.Sl}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  {item.ProductName}
                </td>
                <td className="px-5 py-3 whitespace-nowrap">{item.Category}</td>
                <td className="px-5 py-3 whitespace-nowrap">{item.Quantity}</td>
                <td className="px-5 py-3 whitespace-nowrap">
                  {item.ManufacturePrice}
                </td>
                <td className="px-1 py-3 whitespace-nowrap w-24">
                  {item.WholeSalePrice}
                </td>
                <td className="px-1 py-3 whitespace-nowrap w-24">
                  {item.WholeSaleQuantity}
                </td>
                <td className="px-5 py-3 whitespace-nowrap">
                  {item.StoreLocation}
                </td>
                
                <td className="px-5 py-3 whitespace-nowrap">
                  {editItem?.Sl === item.Sl ? (
                    <button
                      onClick={handleSave}
                      className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                    onClick={() => {
                      setEditItem(item);
                      setShowEditForm(true);
                    }}
                      className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Edit
                    </button>
                  )}
                  {/* Delete Button */}
                  <button
                    onClick={() => handleDelete(item.Sl)} // Use item.Sl instead of item.sl
                    className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-2"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Previous
        </button>
        <button
          onClick={handleNextPage}
          disabled={startIndex + itemsPerPage >= filteredData.length}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Next
        </button>
      </div>

      {/* Add Item Popup Form */}
      {showAddForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl mb-4">Add New Product</h2>
            <input
              type="text"
              value={newItem.ProductName}
              onChange={(e) =>
                setNewItem({ ...newItem, ProductName: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Product Name"
            />
            <input
              type="text"
              value={newItem.Description}
              onChange={(e) =>
                setNewItem({ ...newItem, Description: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Description"
            />
            <input
              type="text"
              value={newItem.Category}
              onChange={(e) =>
                setNewItem({ ...newItem, Category: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Category"
            />
            <input
              type="text"
              value={newItem.HsnCode}
              onChange={(e) =>
                setNewItem({ ...newItem, HsnCode: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="HsnCode"
            />
            <input
              type="number"
              value={newItem.Quantity}
              onChange={(e) =>
                setNewItem({ ...newItem, Quantity: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Quantity"
            />
            <input
              type="number"
              value={newItem.ManufacturePrice}
              onChange={(e) =>
                setNewItem({ ...newItem, ManufacturePrice: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Manufacture Price"
            />
            <input
              type="number"
              value={newItem.Cgst}
              onChange={(e) => setNewItem({ ...newItem, Cgst: e.target.value })}
              className="border p-2 mb-2 w-full"
              placeholder="CGST"
            />
            <input
              type="number"
              value={newItem.Sgst}
              onChange={(e) => setNewItem({ ...newItem, Sgst: e.target.value })}
              className="border p-2 mb-2 w-full"
              placeholder="SGST"
            />
            <input
              type="number"
              value={newItem.Igst}
              onChange={(e) => setNewItem({ ...newItem, Igst: e.target.value })}
              className="border p-2 mb-2 w-full"
              placeholder="IGST"
            />
            <input
              type="number"
              value={newItem.TotalGst}
              onChange={(e) =>
                setNewItem({ ...newItem, TotalGst: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Total Gst"
            />
            <input
              type="date"
              value={newItem.Expiry}
              onChange={(e) =>
                setNewItem({ ...newItem, Expiry: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Expiry"
            />
            <input
              type="text"
              value={newItem.MinSellPrice}
              onChange={(e) =>
                setNewItem({ ...newItem, MinSellPrice: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Min Sell Price"
            />
            <input
              type="number"
              value={newItem.WholeSaleQuantity}
              onChange={(e) =>
                setNewItem({ ...newItem, WholeSaleQuantity: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Whole Sale Quantity"
            />
            <input
              type="number"
              value={newItem.WholeSalePrice}
              onChange={(e) =>
                setNewItem({ ...newItem, WholeSalePrice: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Whole Sale Price"
            />
            <input
              type="text"
              value={newItem.StoreLocation}
              onChange={(e) =>
                setNewItem({ ...newItem, StoreLocation: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Store Location"
            />
            <input
              type="text"
              value={newItem.BaseUnit}
              onChange={(e) =>
                setNewItem({ ...newItem, BaseUnit: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Base Unit"
            />
            <input
              type="number"
              value={newItem.BaseUnitPrice}
              onChange={(e) =>
                setNewItem({ ...newItem, BaseUnitPrice: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Base Unit Price"
            />
            <button
              onClick={handleAddItem}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Add Product
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 w-full"
            >
              Cancel
            </button>
          </div>
           {/* Items per page selection */}
        <div className="flex items-center">
            <label htmlFor="itemsPerPage" className="mr-2">Items per page:</label>
            <select
                id="itemsPerPage"
                value={itemsPerPage}
                onChange={(e) => setItemsPerPage(parseInt(e.target.value))}
                className="border border-gray-300 rounded-md px-2 py-1"
            >
                <option value="10">10</option>
                <option value="25">25</option>
                <option value="50">50</option>
                <option value="100">100</option>
            </select>
        </div>
          {/* Pagination buttons */}
          <div>
            <button
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Previous
            </button>
            <button
              onClick={handleNextPage}
              disabled={startIndex + itemsPerPage >= filteredData.length}
              className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Edit Item Popup Form */}
      {/* {showEditForm && (
        <div className="fixed inset-0 flex justify-center items-center bg-gray-900 bg-opacity-50">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl mb-4">Edit Product</h2>
            <input
              type="text"
              value={editItem.ProductName}
              onChange={(e) =>
                setEditItem({ ...editItem, ProductName: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Product Name"
            />
            <input
              type="text"
              value={editItem.Category}
              onChange={(e) =>
                setEditItem({ ...editItem, Category: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Category"
            />
            <input
              type="number"
              value={editItem.Quantity}
              onChange={(e) =>
                setEditItem({ ...editItem, Quantity: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Quantity"
            />
            <input
              type="number"
              value={editItem.purchase_rate}
              onChange={(e) =>
                setEditItem({ ...editItem, purchase_rate: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Purchase Rate"
            />
            <input
              type="number"
              value={editItem.wholesale_price}
              onChange={(e) =>
                setEditItem({ ...editItem, wholesale_price: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Wholesale Price"
            />
            <input
              type="number"
              value={editItem.min_wholesale_qty}
              onChange={(e) =>
                setEditItem({ ...editItem, min_wholesale_qty: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Min Wholesale Qty"
            />
            <input
              type="text"
              value={editItem.itm_location}
              onChange={(e) =>
                setEditItem({ ...editItem, itm_location: e.target.value })
              }
              className="border p-2 mb-2 w-full"
              placeholder="Item Location"
            />
            <button
              onClick={handleSave}
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full"
            >
              Save Changes
            </button>
            <button
              onClick={() => setShowEditForm(false)}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded mt-2 w-full"
            >
              Cancel
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default TableComponent;
