import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';

const PartyList = ({ parties, onPartyClick }) => (
  <div className="space-y-2">
    {parties.map((party, index) => (
      <div
        key={index}
        className={`p-2 rounded-md ${index === 0 ? 'bg-blue-50' : 'hover:bg-gray-50'}`}
      >
        <div className="flex justify-between items-center">
          <Link
            to="#"
            onClick={() => onPartyClick(party)}
            className="text-sm text-blue-600 hover:underline"
          >
            {party.Name}
          </Link>
          <div className="text-sm">{party.phone}</div>
        </div>
      </div>
    ))}
  </div>
);

const TransactionTable = ({ transactions, onEdit, onReprint }) => (
  <div>
    <h3 className="text-lg font-semibold mb-4">TRANSACTIONS</h3>
    <table className="w-full overflow-x-auto">
      <thead>
        <tr className="text-left border-b">
          <th className="pb-2">Invoice no</th>
          <th className="pb-2">DATE</th>
          <th className="pb-2">Status</th>
          <th className="pb-2">Transaction Status</th>
          <th className="pb-2">Total GST</th>
          <th className="pb-2">Total Amount</th>
          <th className="pb-2">Paid Amount</th>
          <th className="pb-2">Balance Amount</th>
          <th className="pb-2">Transaction Type</th>
          <th className="pb-2">Actions</th>
        </tr>
      </thead>
      <tbody>
        {transactions && transactions.length > 0 ? (
          transactions.map((transaction, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              <td className="py-3">{transaction.invoiceID}</td>
              <td>{moment(transaction.Date).format('YYYY-MM-DD')}</td>
              <td className="py-3">{transaction.TransectionType}</td>
              <td>{transaction.TransectionStatus}</td>
              <td>{transaction.totalGst}</td>
              <td>{transaction.TotalAmount}</td>
              <td>{transaction.PaidAmount}</td>
              <td>{transaction.BalanceAmount}</td>
              <td>{transaction.PaymentType}</td>
              <td>
                <button 
                  onClick={() => onEdit(transaction)}
                  className="text-blue-600 hover:text-blue-800 mr-2"
                >
                  Edit
                </button>
                <button 
                  onClick={() => onReprint(transaction)}
                  className="text-green-600 hover:text-green-800"
                >
                  Reprint
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="10" className="text-center py-4">
              No transactions available.
            </td>
          </tr>
        )}
      </tbody>
    </table>
  </div>
);

const Parties = () => {
  const [parties, setParties] = useState([]);
  const [allTransactions, setAllTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [transactionSearchQuery, setTransactionSearchQuery] = useState('');
  const [selectedParty, setSelectedParty] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newParty, setNewParty] = useState({
    Name: '',
    phone: '',
    Email: '',
    Gstin: '',
    CompanyName: '',
    Address: '',
    City: '',
    State: '',
    Pin: '',
    Country: '',
    CustomerType: '',
  });

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/venders');
        const data = await response.json();
        setParties(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/customer/transection');
        const data = await response.json();
        setAllTransactions(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    fetchVendors();
    fetchTransactions();
  }, []);
  

  useEffect(() => {
    let filtered = allTransactions;

    if (selectedParty) {
      filtered = filtered.filter(transaction => 
        transaction.mobile === selectedParty.PhoneNumber
      );
    }

    if (transactionSearchQuery) {
      const lowerQuery = transactionSearchQuery.toLowerCase();
      filtered = filtered.filter(transaction => {
        return (
          transaction.invoiceID?.toLowerCase().includes(lowerQuery) ||
          moment(transaction.Date).format('YYYY-MM-DD').includes(transactionSearchQuery) ||
          transaction.TransectionStatus?.toLowerCase().includes(lowerQuery) ||
          transaction.TotalAmount?.toString().includes(transactionSearchQuery) ||
          transaction.PaidAmount?.toString().includes(transactionSearchQuery) ||
          transaction.BalanceAmount?.toString().includes(transactionSearchQuery)
        );
      });
    }

    setFilteredTransactions(filtered);
  }, [selectedParty, transactionSearchQuery, allTransactions]);

  const handleEditTransaction = (transaction) => {
    console.log('Edit transaction:', transaction);
    // Implement edit logic
  };

  const handleReprintInvoice = (transaction) => {
    console.log('Reprint invoice:', transaction);
    // Implement reprint logic
  };

  const handlePartyClick = (party) => {
    setSelectedParty(party);
  };

  const filteredParties = parties.filter(party => {
    const searchLower = searchQuery.toLowerCase();
    return (
      party.Name?.toLowerCase().includes(searchLower) ||
      party.phone?.includes(searchQuery) ||
      party.Email?.toLowerCase().includes(searchLower)
    );
  });
  const toggleModal = () => setIsModalVisible(!isModalVisible);

  const handleAddParty = async (e) => {
    e.preventDefault();

    // Create a party object without the Sl (auto-generated)
    const partyData = { ...newParty };
    delete partyData.Sl;  // Ensure Sl is not sent in the POST request

    try {
      // Check if we are adding or updating
      const response = partyData.Sl
        ? await fetch(`http://localhost:5000/api/venders/${partyData.Sl}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partyData),
        })
        : await fetch('http://localhost:5000/api/venders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(partyData),
        });

      if (response.ok) {
        const updatedParty = await response.json(); // API response returns the updated or new party

        // If updating, replace the existing party in the list
        if (partyData.Sl) {
          setParties((prev) =>
            prev.map((party) => (party.Sl === updatedParty.Sl ? updatedParty : party))
          );
        } else {
          // If it's a new party, add it to the list
          setParties((prev) => [...prev, updatedParty]);
        }

        // Reset form and close modal
        setNewParty({
          Name: '',
          phone: '',
          Email: '',
          Gstin: '',
          CompanyName: '',
          Address: '',
          City: '',
          State: '',
          Pin: '',
          Country: '',
          CustomerType: '',
        });

        toggleModal();
      } else {
        console.error('Error adding/updating party:', await response.text());
      }
    } catch (error) {
      console.error('Error adding/updating party:', error);
    }
  };
  useEffect(() => {
    let filtered = allTransactions;
  
    if (selectedParty) {
      filtered = filtered.filter(transaction => 
        transaction.mobile === selectedParty.PhoneNumber
      );
    }
  
    if (transactionSearchQuery) {
      const lowerQuery = transactionSearchQuery.toLowerCase();
      filtered = filtered.filter(transaction => {
        return (
          String(transaction.invoiceID).toLowerCase().includes(lowerQuery) || // Convert to string
          moment(transaction.Date).format('YYYY-MM-DD').includes(transactionSearchQuery) ||
          String(transaction.TransectionStatus).toLowerCase().includes(lowerQuery) ||
          String(transaction.TotalAmount).includes(transactionSearchQuery) || // For numeric values
          String(transaction.PaidAmount).includes(transactionSearchQuery) ||
          String(transaction.BalanceAmount).includes(transactionSearchQuery)
        );
      });
    }
  
    setFilteredTransactions(filtered);
  }, [selectedParty, transactionSearchQuery, allTransactions]);
  return (
    <div className="h-[90vh] bg-gray-50">
      <div className="p-4 border-b flex items-center justify-between bg-white">
        <div className="relative">
          <input
            type="text"
            placeholder="Search Parties"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8 pr-4 py-2 border rounded-md w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 bg-green-50 text-green-600 rounded-md" onClick={() => setIsModalVisible(true)}>
            + Add Party
          </button>
          <button className="px-4 py-2 bg-blue-50 text-blue-600 rounded-md">
            + Add Sale
          </button>
          <button className="px-4 py-2 bg-yellow-50 text-yellow-600 rounded-md">
            + Add Purchase
          </button>
          <button className="px-4 py-2 bg-red-50 text-red-600 rounded-md">
            + Sale Return
          </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        <div className="w-full md:w-72 border-r bg-white p-4">
          <PartyList parties={filteredParties} onPartyClick={handlePartyClick} />
        </div>

        <div className="flex-1 p-6">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search Transactions..."
              value={transactionSearchQuery}
              onChange={(e) => setTransactionSearchQuery(e.target.value)}
              className="pl-8 pr-4 py-2 border rounded-md w-64"
            />
          </div>
          <TransactionTable 
            transactions={filteredTransactions} 
            onEdit={handleEditTransaction}
            onReprint={handleReprintInvoice}
          />
        </div>
      </div>

           {/* Modal for Add Party Form */}
           {isModalVisible && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md w-96">
            <h3 className="text-xl font-semibold mb-4">Add New Party</h3>
            <form onSubmit={handleAddParty}>
              <div className="mb-4">
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  name="Name"
                  value={newParty.Name}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  placeholder="Name"
                  required
                />
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  name="phone"
                  value={newParty.phone}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  placeholder="Phone"
                  required
                />
                <input
                  type="email"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  name="Email"
                  value={newParty.Email}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  placeholder="Email"
                  required
                />
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  name="Gstin"
                  value={newParty.Gstin}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  placeholder="Gstin"
                  required
                />
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  name="CompanyName"
                  value={newParty.CompanyName}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  placeholder="Company Name"
                  required
                />
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  name="Address"
                  value={newParty.Address}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  placeholder="Address"
                  required
                />
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  name="City"
                  value={newParty.City}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  placeholder="City"
                  required
                />
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  name="State"
                  value={newParty.State}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  placeholder="State"
                  required
                />
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  name="Pin"
                  value={newParty.Pin}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  placeholder="Pin"
                  required
                />
                <input
                  type="text"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  name="Country"
                  value={newParty.Country}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  placeholder="Country"
                  required
                />
                <select
                  name="CustomerType"
                  className="mt-1 block w-full border rounded-md shadow-sm p-2"
                  value={newParty.CustomerType}
                  onChange={(e) =>
                    setNewParty((prev) => ({ ...prev, [e.target.name]: e.target.value }))
                  }
                  required
                >
                  <option value="" >Select</option>
                  <option value="Retail" >Retail</option>
                  <option value="Wholesale" >Wholesale</option>
                </select>
                <div className='flex justify-between mt-4'>
                <button
                  type="button"
                  onClick={toggleModal}
                  className="text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded-md">Update Party</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Parties;