const db = require('../config/db');

const getMaterials = (req, res) => {
  const sql = `
    SELECT m.materialID, m.materialName, s.supplierID, s.supplierName
    FROM tblMaterial m
    JOIN tblSupplier s ON m.supplierID = s.supplierID
    ORDER BY m.materialID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const createMaterial = (req, res) => {
  const { materialName, supplierID } = req.body;
  if (!materialName || !supplierID) {
    return res.status(400).json({ error: 'Material name and supplier are required' });
  }
  db.query('INSERT INTO tblMaterial (materialName, supplierID) VALUES (?, ?)', [materialName, supplierID], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Material added successfully', materialID: result.insertId });
  });
};

const updateMaterial = (req, res) => {
  const { materialName, supplierID } = req.body;
  db.query('UPDATE tblMaterial SET materialName = ?, supplierID = ? WHERE materialID = ?', [materialName, supplierID, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Material updated successfully' });
  });
};

const deleteMaterial = (req, res) => {
  db.query('DELETE FROM tblMaterial WHERE materialID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Material deleted successfully' });
  });
};

module.exports = { getMaterials, createMaterial, updateMaterial, deleteMaterial };
