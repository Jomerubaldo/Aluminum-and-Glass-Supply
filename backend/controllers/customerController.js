const db = require('../config/db');

const getCustomers = (req, res) => {
  const sql = 'SELECT * FROM tblCustomer ORDER BY customerID DESC';
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createCustomer = (req, res) => {
  const { customerName, phoneNumber, address } = req.body;
  if (!customerName || !address) {
    return res.status(400).json({ error: 'Customer name and address are required' });
  }
  const sql = 'INSERT INTO tblCustomer (customerName, phoneNumber, address) VALUES (?, ?, ?)';
  db.query(sql, [customerName, phoneNumber, address], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Customer added successfully', customerID: result.insertId });
  });
};

const updateCustomer = (req, res) => {
  const { customerName, phoneNumber, address } = req.body;
  const sql = 'UPDATE tblCustomer SET customerName = ?, phoneNumber = ?, address = ? WHERE customerID = ?';
  db.query(sql, [customerName, phoneNumber, address, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Customer updated successfully' });
  });
};

const deleteCustomer = (req, res) => {
  const sql = 'DELETE FROM tblCustomer WHERE customerID = ?';
  db.query(sql, [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Customer deleted successfully' });
  });
};

module.exports = { getCustomers, createCustomer, updateCustomer, deleteCustomer };
