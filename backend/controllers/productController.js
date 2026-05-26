const db = require('../config/db');

const getProducts = (req, res) => {
  db.query('SELECT * FROM tblProduct ORDER BY productID DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createProduct = (req, res) => {
  const { productName, price } = req.body;
  if (!productName || !price) {
    return res.status(400).json({ error: 'Product name and price are required' });
  }
  db.query('INSERT INTO tblProduct (productName, price) VALUES (?, ?)', [productName, price], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product added successfully', productID: result.insertId });
  });
};

const updateProduct = (req, res) => {
  const { productName, price } = req.body;
  db.query('UPDATE tblProduct SET productName = ?, price = ? WHERE productID = ?', [productName, price, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product updated successfully' });
  });
};

const deleteProduct = (req, res) => {
  db.query('DELETE FROM tblProduct WHERE productID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Product deleted successfully' });
  });
};

module.exports = { getProducts, createProduct, updateProduct, deleteProduct };
