const express = require("express");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// Set up MySQL connection pool
let db;
(async () => {
  try {
    db = mysql.createPool({
      host: "localhost",
      user: "root", // Replace with your username
      password: "", // Replace with your password
      database: "supriya-crm",
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
    console.log("Connected to MySQL database");
  } catch (error) {
    console.error("Error connecting to database:", error);
    process.exit(1); // Exit if the database connection fails
  }
})();


// Invoice Creation Endpoint
app.post("/api/create_invoice", async (req, res) => {
  const { body } = req;
  
  // Validation
  const requiredFields = [
    'customerName', 'phone', 'email', 'date',
    'totalAmount', 'transactionType', 'items'
  ];
  
  const missingFields = requiredFields.filter(field => !body[field]);
  if (missingFields.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missingFields.join(', ')}`
    });
  }

  if (!/^\d{10}$/.test(body.phone)) {
    return res.status(400).json({ error: "Invalid phone number format" });
  }

  if (!Array.isArray(body.items) || body.items.length === 0) {
    return res.status(400).json({ error: "Invalid items array" });
  }

  for (const [index, item] of body.items.entries()) {
    if (!item.productName || !item.category || !item.quantity || !item.salePrice) {
      return res.status(400).json({
        error: `Item ${index + 1} missing required fields`
      });
    }
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // Insert invoice
    const [invoiceResult] = await connection.query(
      `INSERT INTO tbl_invoice SET ?`, {
        customerName: body.customerName,
        Phone: body.phone,
        Email: body.email,
        Address: body.address || '',
        City: body.city || '',
        State: body.state || '',
        Pin: body.pin || '',
        Country: body.country || '',
        companyName: body.companyName || '',
        Gstin: body.gstNo || '',
        Date: body.date,
        discountAmount: body.discountAmount || 0,
        Cgst: body.cgst || 0,
        Sgst: body.sgst || 0,
        Igst: body.igst || 0,
        totalGst: body.totalGst || 0,
        TotalAmount: body.totalAmount,
        PaidAmount: body.paidAmount || 0,
        BalanceAmount: body.balanceAmount || 0,
        TransectionType: body.transactionType,
        TransectionStatus: body.transactionStatus || 'Pending',
        PaymentType: body.paymentType || 'Cash',
        BillerName: body.billerName || 'Admin'
      }
    );

    // Insert items
    const invoiceId = invoiceResult.insertId;
    const itemValues = body.items.map(item => [
      invoiceId,
      item.productName,
      item.category,
      item.quantity,
      item.salePrice,
      item.total || item.quantity * item.salePrice,
      item.totalDiscountAmount || 0,
      body.transactionType
    ]);

    await connection.query(
      `INSERT INTO tbl_invoiceitem 
      (invoiceID, ProductName, Category, Quantity, SalePrice, Total, TotalDiscountAmount, TransectionType)
      VALUES ?`,
      [itemValues]
    );

    await connection.commit();
    res.json({
      success: true,
      message: "Invoice created successfully",
      invoiceId
    });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error("Database Error:", error);
    res.status(500).json({
      error: "Internal server error",
      details: error.message
    });
  } finally {
    if (connection) connection.release();
  }
});

// Get Invoices Endpoint
app.get('/api/invoices', async (req, res) => {
  try {
    const [invoices] = await db.query(`
      SELECT * FROM tbl_invoice 
      ORDER BY Date DESC
      LIMIT 100
    `);
    res.json(invoices);
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Failed to fetch invoices" });
  }
});

// Get Single Invoice Endpoint
app.get('/api/invoices/:id', async (req, res) => {
  try {
    const [invoice] = await db.query(`
      SELECT * FROM tbl_invoice 
      WHERE invoiceID = ?
    `, [req.params.id]);

    const [items] = await db.query(`
      SELECT * FROM tbl_invoiceitem 
      WHERE invoiceID = ?
    `, [req.params.id]);

    if (invoice.length === 0) {
      return res.status(404).json({ error: "Invoice not found" });
    }

    res.json({
      ...invoice[0],
      items
    });

  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ error: "Failed to fetch invoice" });
  }
});

// // Endpoint to create an invoice
// app.post("/api/create_invoice", async (req, res) => {
//   const { customerName, phone, email, address, city, state, pin, country, companyName, gstNo, date, discountAmount, cgst, sgst, igst, totalGst, totalAmount, paidAmount, balanceAmount, transactionType, transactionStatus, paymentType, billerName = "Admin", items } = req.body;

//   if (!customerName || !phone || !email) {
//     return res.status(400).json({ error: "Customer name, phone, and email are required" });
//   }

//   // Validate phone number
//   if (!/^\d{10,15}$/.test(phone)) {
//     return res.status(400).json({ error: "Invalid phone number format" });
//   }

//   // Validate items
//   if (!Array.isArray(items) || items.length === 0) {
//     return res.status(400).json({ error: "Items array cannot be empty" });
//   }

//   for (const item of items) {
//     const { productName, category, quantity, salePrice } = item;
//     if (!productName || !category || quantity == null || salePrice == null) {
//       return res.status(400).json({ error: "Missing required fields in items" });
//     }
//   }

//   let connection;
//   try {
//     connection = await db.getConnection();
//     await connection.beginTransaction();

//     // Insert invoice data into tbl_invoice
//     const [invoiceResult] = await connection.query(
//       `INSERT INTO tbl_invoice (customerName, Phone, Email, Address, City, State, Pin, Country, companyName, Gstin, Date, discountAmount, Cgst, Sgst, Igst, totalGst, TotalAmount, PaidAmount, BalanceAmount, TransectionType, TransectionStatus, PaymentType, BillerName) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [customerName, phone, email, address, city, state, pin, country, companyName, gstNo, date, discountAmount, cgst, sgst, igst, totalGst, totalAmount, paidAmount, balanceAmount, transactionType, transactionStatus, paymentType, billerName]
//     );

//     const invoiceID = invoiceResult.insertId;

//     // Insert items into tbl_invoiceitem
//     for (const item of items) {
//       const { productName, category, quantity, salePrice, total, totalDiscountAmount } = item;
//       await connection.query(
//         `INSERT INTO tbl_invoiceitem (invoiceID, ProductName, Category, Quantity, SalePrice, Total, TotalDiscountAmount, TransectionType) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         [invoiceID, productName, category, quantity, salePrice, total || 0, totalDiscountAmount || 0, transactionType]
//       );
//     }

//     // Commit the transaction
//     await connection.commit();
//     res.json({ message: "Invoice and items created successfully", invoiceID });
//   } catch (err) {
//     if (connection) await connection.rollback(); // Rollback transaction on error
//     console.error("Error creating invoice:", err);
//     console.error("Full error:", err.stack || err); // Log stack trace or full error
//     res.status(500).json({
//       error: "Error creating invoice",
//       details: err.stack || err.message || err, // Log the detailed error message
//     });
//   } finally {
//     if (connection) connection.release(); // Release connection back to pool
//   }
// });
// Sales data endpoint
app.get("/api/sales", async (req, res) => {
  try {
    // Execute the SQL query
    const query = `
      SELECT
        DATE(Date) AS date,
        SUM(CASE WHEN TransectionType = 'Sale' THEN Amount ELSE 0 END) AS sales,
        SUM(CASE WHEN TransectionType = 'Revenue' THEN Amount ELSE 0 END) AS revenue
      FROM
        tbl_transections
      WHERE
        Date BETWEEN '2025-01-01' AND '2025-01-07'
      GROUP BY
        DATE(Date)
      ORDER BY
        DATE(Date);
    `;

    const [results] = await db.query(query); // Use promise-based query

    // Respond with the results as JSON
    res.json(results);
  } catch (err) {
    console.error("Error fetching sales data:", err.message);
    res
      .status(500)
      .json({ error: "Error fetching data", message: err.message });
  }
});


// Endpoint to fetch pie data
app.get("/api/pie-data", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM tbl_pie_data");
    res.json(results);
  } catch (err) {
    console.error("Error fetching pie data:", err.message);
    res
      .status(500)
      .json({ error: "Error fetching data", message: err.message });
  }
});

// Endpoint to fetch engagement data
app.get("/api/engagement-data", async (req, res) => {
  try {
    // Correct query usage with promise
    const [results] = await db.query("SELECT * FROM tbl_engagement_data");
    res.json(results);
  } catch (err) {
    console.error("Error fetching engagement data:", err.message);
    res
      .status(500)
      .json({ error: "Error fetching data", message: err.message });
  }
});

// Fetch all products
app.get("/data", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM tbl_products");
    res.json(results);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// API endpoint to get the sum
app.get("/api/sum", (req, res) => {
  const query = "SELECT SUM(amount) AS total_sum FROM orders";

  connection.query(query, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }

    // Send the total sum as a JSON response
    res.json({ totalSum: results[0].total_sum });
  });
});

// Fetch all vendors
app.get("/api/venders", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM tbl_customer");
    res.json(results);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});

// Fetch all customer transactions
app.get('/api/customer/transection', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM tbl_invoice');
    res.json(results);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Error fetching data' });
  }
});
// Fetch all customer transactions
app.get('/api/customer/invoice/items', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM tbl_invoiceitem');
    res.json(results);
  } catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).json({ error: 'Error fetching data' });
  }
});

// Fetch all company info
app.get("/company", async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM tbl_company_info");
    res.json(results);
  } catch (err) {
    console.error("Error fetching data:", err);
    res.status(500).json({ error: "Error fetching data" });
  }
});


// Update party endpoint

app.post("/api/venders", async (req, res) => {
  console.log("Request body:", req.body); // Log the request body
  const {Name, phone, Email, Gstin, CompanyName, Address, City, State, Pin, Country, CustomerType,} = req.body;

  // Check if all required fields are provided
  if (!Name || !phone || !Email || !Gstin || !CompanyName || !Address || !City || !State || !Pin || !Country || !CustomerType) {
    return res.status(400).json({ error: "All fields are required" });
  }

  // Insert new party into tbl_customer table
  const insertQuery = `INSERT INTO tbl_customer (Name, phone, Email, Gstin, CompanyName, Address, City, State, Pin, Country, CustomerType)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  try {
    const [result] = await db.query(insertQuery, [Name,phone,Email,Gstin,CompanyName,Address,City,State,Pin,Country,CustomerType,]);
    res
      .status(201)
      .json({ message: "Party added successfully", id: result.insertId });
  } catch (err) {
    console.error("Error adding vendor:", err);
    res.status(500).json({ error: "Error adding vendor" });
  }
});


// app.post("/api/create_invoice", async (req, res) => {
//   const {customerName, phone, email, address, city, state, pin, country, companyName, gstNo, date, discountAmount, cgst, sgst, igst, totalGst, totalAmount, paidAmount, balanceAmount, transactionType, transactionStatus, paymentType, billerName = "Admin", items, // Array of items
//   } = req.body;

//   if (!customerName || !phone || !email) {
//     return res
//       .status(400)
//       .json({ error: "Customer name, phone, and email are required" });
//   }

//   // Validate phone as a string to prevent numeric overflow
//   if (!/^\d{10,15}$/.test(phone)) {
//     return res.status(400).json({ error: "Invalid phone number format" });
//   }

//   if (!Array.isArray(items) || items.length === 0) {
//     return res.status(400).json({ error: "Items array cannot be empty" });
//   }

//   // Validate that each item has all required fields
//   for (const item of items) {
//     const { productName, category, quantity, salePrice } = item;

//     if (!productName || !category || quantity == null || salePrice == null) {
//       return res
//         .status(400)
//         .json({ error: "Missing required fields in items" });
//     }
//   }

//   let connection;
//   try {
//     connection = await db.getConnection();
//     await connection.beginTransaction();

//     // Insert invoice data into tbl_invoice
//     const [invoiceResult] = await connection.query(
//       `INSERT INTO tbl_invoice (customerName, Phone, Email, Address, City, State, Pin, Country, companyName, Gstin, Date, discountAmount, Cgst, Sgst, Igst, totalGst, TotalAmount, PaidAmount, BalanceAmount, TransectionType, TransectionStatus, PaymentType, BillerName) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [ customerName, phone, email, address, city, state, pin, country, companyName, gstNo, date, discountAmount, cgst, sgst, igst, totalGst, totalAmount, paidAmount, balanceAmount, transactionType, transactionStatus, paymentType, billerName,]
//     );

//     const invoiceID = invoiceResult.insertId;

//     // Insert invoice items into tbl_invoiceitem
//     for (const item of items) {
//       const {
//         productName,
//         category,
//         quantity,
//         salePrice,
//         total,
//         totalDiscountAmount,
//       } = item;

//       await connection.query(
//         `INSERT INTO tbl_invoiceitem (invoiceID, ProductName, Category, Quantity, SalePrice, Total, TotalDiscountAmount, TransectionType) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         [invoiceID, productName, category, quantity, salePrice, total || 0, totalDiscountAmount || 0, transactionType,]
//       );
//     }

//     // Commit the transaction
//     await connection.commit();
//     res.json({ message: "Invoice and items created successfully", invoiceID });
//   } catch (err) {
//     if (connection) await connection.rollback(); // Rollback transaction on error
//     console.error("Error creating invoice:", err);
//     res
//       .status(500)
//       .json({ error: "Error creating invoice", details: err.message });
//   } finally {
//     if (connection) connection.release(); // Release the connection back to the pool
//   }
// });

// Delete a product
app.delete("/data/:sl", async (req, res) => {
  const productSl = req.params.sl;

  console.log("Product SL:", productSl); // Log to confirm SL is being passed correctly

  if (!productSl) {
    return res.status(400).json({ error: "Product SL is required" });
  }

  const deleteQuery = "DELETE FROM tbl_products WHERE sl = ?";

  try {
    const [result] = await db.query(deleteQuery, [productSl]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error("Error deleting product:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});

// // Endpoint to create an invoice and its items
// app.post("/api/create_invoice", async (req, res) => {
//   const {customerName, phone, email, address, city, state, pin, country, companyName, gstNo, date, discountAmount, cgst, sgst, igst, totalGst, totalAmount, paidAmount, balanceAmount, transactionType, transactionStatus, paymentType, billerName, items, // Array of items
//   } = req.body;

//   let connection;
//   try {
//     // Get a connection from the pool
//     connection = await db.getConnection();
//     await connection.beginTransaction();

//     // Insert invoice data into tbl_invoice
//     const [invoiceResult] = await connection.query(
//       `INSERT INTO tbl_invoice (customerName, Phone, Email, Address, City, State, Pin, Country, companyName, Gstin, Date, discountAmount, Cgst, Sgst, Igst, totalGst, TotalAmount, PaidAmount, BalanceAmount, TransectionType, TransectionStatus, PaymentType, BillerName) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
//       [customerName, phone, email, address, city, state, pin, country, companyName, gstNo, date, discountAmount, cgst, sgst, igst, totalGst, totalAmount, paidAmount, balanceAmount, transactionType, transactionStatus, paymentType, billerName,]
//     );

//     const invoiceID = invoiceResult.insertId;

//     // Insert invoice items into tbl_invoiceitem
//     for (const item of items) {
//       await connection.query(
//         `INSERT INTO tbl_invoiceitem (invoiceID, ProductName, Category, Quantity, SalePrice, Total, TotalDiscountAmount, TransectionType) 
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
//         [invoiceID, item.productName, item.category, item.quantity, item.salePrice, item.total, item.totalDiscountAmount, transactionType,]);
//     }

//     // Commit the transaction
//     await connection.commit();
//     res.json({ message: "Invoice and items created successfully", invoiceID });
//   } catch (err) {
//     if (connection) await connection.rollback(); // Rollback transaction on error
//     console.error("Error creating invoice:", err);
//     res
//       .status(500)
//       .json({ error: "Error creating invoice", details: err.message });
//   } finally {
//     if (connection) connection.release(); // Release the connection back to the pool
//   }
// });



// Add a product
app.post("/data", async (req, res) => {
  const {ProductName, Description, Category, HsnCode, Quantity, ManufacturePrice, Cgst, Sgst, Igst, TotalGst, Expiry, MinSellPrice, WholeSaleQuantity, WholeSalePrice, StoreLocation, BaseUnit, BaseUnitPrice,
  } = req.body;

  // Ensure all required fields are provided
  if ( !ProductName || !Description || !Category || !HsnCode || !Expiry || !StoreLocation || !BaseUnit) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const insertQuery = `
    INSERT INTO tbl_products 
    (ProductName, Description, Category, HsnCode, Quantity, ManufacturePrice, Cgst, Sgst, Igst, TotalGst, Expiry, MinSellPrice, WholeSaleQuantity, WholeSalePrice, StoreLocation, BaseUnit, BaseUnitPrice)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(insertQuery, [ ProductName, Description, Category, HsnCode, Quantity || 0, ManufacturePrice || 0, Cgst || 0, Sgst || 0, Igst || 0, TotalGst || 0, Expiry, MinSellPrice || 0, WholeSaleQuantity || 0, WholeSalePrice || 0, StoreLocation, BaseUnit, BaseUnitPrice || 0,
    ]);
    res.json({ message: "Product added successfully", id: result.insertId });
  } catch (err) {
    console.error("Error adding product:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

// Start the server
app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
