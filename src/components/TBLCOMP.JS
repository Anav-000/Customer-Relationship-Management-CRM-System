import React, { useState, useEffect } from 'react';

const TableComponent = () => {
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [editItem, setEditItem] = useState(null);  // State for the item to edit
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/data');
                const jsonData = await response.json();
                setData(jsonData);
            } catch (error) {
                console.error('Error fetching data:', error);
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
    const currentData = data.slice(startIndex, startIndex + itemsPerPage);

    const handleEdit = (item) => {
        setEditItem(item); // Open the modal with the item data to edit
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`http://localhost:5000/data/${editItem.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editItem),
            });

            if (response.ok) {
                const updatedProduct = await response.json();

                // Update local state to reflect the changes
                setData((prevData) =>
                    prevData.map((item) =>
                        item.id === editItem.id ? updatedProduct.updatedProduct : item
                    )
                );

                setEditItem(null); // Close the modal
            } else {
                console.error('Failed to update product');
            }
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

    return (
        <div className="container mx-auto px-4 h-[90vh] overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
                <thead>
                    <tr>
                        <th>Sl</th>
                        <th>Product Name</th>
                        <th>Category</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Wholesale Rate</th>
                        <th>Min Wholesale Qty</th>
                        <th>Itm Location</th>
                        <th>Disc per</th>
                        <th>Dsc Amt</th>
                        <th>Record</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item, index) => (
                        <tr key={item.id}>
                            <td>{startIndex + index + 1}</td>
                            <td>{item.pro_comp_name}</td>
                            <td>{item.category}</td>
                            <td>{item.quantity}</td>
                            <td>{item.purchase_rate}</td>
                            <td>{item.wholesale_price}</td>
                            <td>{item.min_wholesale_qty}</td>
                            <td>{item.itm_location}</td>
                            <td>{item.discPer}</td>
                            <td>{item.dscAmt}</td>
                            <td>
                                <button onClick={() => handleEdit(item)}>Edit</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {editItem && (
                <div className="modal">
                    <h2>Edit Product</h2>
                    <input
                        type="text"
                        value={editItem.pro_comp_name}
                        onChange={(e) => setEditItem({ ...editItem, pro_comp_name: e.target.value })}
                    />
                    {/* Other input fields for other product properties */}

                    <button onClick={handleSave}>Save</button>
                    <button onClick={() => setEditItem(null)}>Cancel</button>
                </div>
            )}

            <div className="pagination">
                <button onClick={handlePreviousPage}>Previous</button>
                <button onClick={handleNextPage}>Next</button>
            </div>
        </div>
    );
};

export default TableComponent;
