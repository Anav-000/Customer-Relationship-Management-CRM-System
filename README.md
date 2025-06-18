import express from 'express';
import mysql from 'mysql2/promise'; // Using the promise version
import cors from 'cors';

// Initialize app
const app = express();
app.use(cors());
app.use(express.json());

// Async function to initialize DB connection
async function initializeDb() {
  try {
    const db = await mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'supriya-crm',
    });
    console.log('Connected to database');
    return db;
  } catch (err) {
    console.error('Error connecting to database:', err.stack);
    throw err; // Rethrow to terminate app
  }
}

// Use async function to connect to the DB
const db = await initializeDb();

// Fetch all products
app.get('/data', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM products');
    res.json(results);
  } catch (err) {
    console.error('Error fetching data:', err);
    return res.status(500).json({ error: 'Error fetching data' });
  }
});

// Fetch all vendors
app.get('/api/venders', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM dbo_venders');
    res.json(results);
  } catch (err) {
    console.error('Error fetching data:', err);
    return res.status(500).json({ error: 'Error fetching data' });
  }
});

// Fetch all vendors transection
app.get('/api/transection', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM transectioninfo');
    res.json(results);
  } catch (err) {
    console.error('Error fetching data:', err);
    return res.status(500).json({ error: 'Error fetching data' });
  }
});

// Fetch all company Info 
app.get('/company', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM companyinfo');
    res.json(results);
  } catch (err) {
    console.error('Error fetching data:', err);
    return res.status(500).json({ error: 'Error fetching data' });
  }
});

// Update a product
app.put('/data/:sl', async (req, res) => {
  const productSl = req.params.sl;
  const {
    pro_comp_name,
    category,
    quantity,
    purchase_rate,
    wholesale_price,
    min_wholesale_qty,
    itm_location,
    discPer,
    dscAmt,
  } = req.body;

  if (!productSl || !pro_comp_name || !category || !quantity || !purchase_rate) {
    return res.status(400).json({ error: 'Missing required fields or product SL' });
  }

  const updateQuery = `
    UPDATE products 
    SET pro_comp_name = ?, category = ?, quantity = ?, purchase_rate = ?, wholesale_price = ?, 
        min_wholesale_qty = ?, itm_location = ?, disc_per = ?, disc_amt = ?
    WHERE sl = ?
  `;

  try {
    const [result] = await db.query(updateQuery, [
      pro_comp_name,
      category,
      quantity,
      purchase_rate,
      wholesale_price,
      min_wholesale_qty,
      itm_location,
      discPer || null,
      dscAmt || null,
      productSl,
    ]);
    
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ 
      message: 'Product updated successfully', 
      updatedProduct: { ...req.body, sl: productSl } 
    });
  } catch (err) {
    console.error('Error updating product:', err);
    return res.status(500).json({ error: 'Failed to update product' });
  }
});

// Create invoice
app.post('/api/create_invoice', async (req, res) => {
  const { customerName, email, phone, date, paidAmount, discount, items } = req.body;

  try {
    // Start the transaction
    await db.beginTransaction();

    // Insert the invoice data into the 'invoices' table
    const [invoice] = await db.query('INSERT INTO invoices (customer_name, customer_email, customer_phone, invoice_date, paid_amount, discount) VALUES (?, ?, ?, ?, ?, ?)', 
      [customerName, email, phone, date, paidAmount, discount]);

    console.log('Invoice created with ID:', invoice.insertId);

    // For each item in the cart, add it to the 'invoice_items' table
    for (const item of items) {
      // Insert the item into the 'invoice_items' table
      await db.query('INSERT INTO invoice_items (invoice_id, product_name, category, quantity, sale_price, total) VALUES (?, ?, ?, ?, ?, ?)', 
        [invoice.insertId, item.product_name, item.category, item.quantity, item.sale_price, item.total]);

      console.log('Item added to invoice:', item);
    }

    // Commit the transaction
    await db.commit();
    res.json({ message: 'Invoice created successfully' });
  } catch (error) {
    console.error('Error creating invoice:', error); // Log the detailed error
    await db.rollback();
    res.status(500).json({ message: 'Error creating invoice', error: error.message });
  }
});




// Add a product
app.post('/data', async (req, res) => {
  const {
    product_name,
    category,
    quantity,
    purchase_rate,
    wholesale_price,
    min_wholesale_qty,
    itm_location,
    discPer,
    dscAmt,
  } = req.body;

  const insertQuery = `
    INSERT INTO products (product_name, category, quantity, purchase_rate, wholesale_price, 
                          min_wholesale_qty, itm_location, disc_per, disc_amt)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  try {
    const [result] = await db.query(insertQuery, [
      product_name,
      category,
      quantity,
      purchase_rate,
      wholesale_price,
      min_wholesale_qty,
      itm_location,
      discPer || null,
      dscAmt || null,
    ]);

    res.json({ message: 'Product added successfully', id: result.insertId });
  } catch (err) {
    console.error('Error adding product:', err);
    return res.status(500).json({ error: 'Failed to add product' });
  }
});

// Start the server
app.listen(5000, () => {
  console.log('Server is running on http://localhost:5000');
});
