import React, { useState } from "react";

const EditItemForm = ({ editItem, setEditItem, handleSave, handleCancel }) => {
  if (!editItem) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-1/2">
        <h2 className="text-xl font-bold mb-4">Edit Item</h2>
        <form>
          {/* Example Input Fields */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              value={editItem.name || ""}
              onChange={(e) =>
                setEditItem({ ...editItem, name: e.target.value })
              }
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter item name"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Price
            </label>
            <input
              type="number"
              value={editItem.price || ""}
              onChange={(e) =>
                setEditItem({ ...editItem, price: parseFloat(e.target.value) })
              }
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter item price"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Quantity
            </label>
            <input
              type="number"
              value={editItem.quantity || ""}
              onChange={(e) =>
                setEditItem({
                  ...editItem,
                  quantity: parseInt(e.target.value, 10),
                })
              }
              className="w-full mt-1 p-2 border rounded"
              placeholder="Enter item quantity"
            />
          </div>

          {/* Save and Cancel Buttons */}
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={handleCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditItemForm;
