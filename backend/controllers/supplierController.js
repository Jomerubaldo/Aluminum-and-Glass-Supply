const db = require('../config/db');

const getSuppliers = (req, res) => {
  db.query('SELECT * FROM tblSupplier ORDER BY supplierID DESC', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createSupplier = (req, res) => {
  const { supplierName, contact } = req.body;
  if (!supplierName || !contact) {
    return res.status(400).json({ error: 'Supplier name and contact are required' });
  }
  db.query('INSERT INTO tblSupplier (supplierName, contact) VALUES (?, ?)', [supplierName, contact], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Supplier added successfully', supplierID: result.insertId });
  });
};

const updateSupplier = (req, res) => {
  const { supplierName, contact } = req.body;
  db.query('UPDATE tblSupplier SET supplierName = ?, contact = ? WHERE supplierID = ?', [supplierName, contact, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Supplier updated successfully' });
  });
};

const deleteSupplier = (req, res) => {
  db.query('DELETE FROM tblSupplier WHERE supplierID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Supplier deleted successfully' });
  });
};

module.exports = { getSuppliers, createSupplier, updateSupplier, deleteSupplier };
