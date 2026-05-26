const db = require('../config/db');

const getInstallations = (req, res) => {
  const sql = `
    SELECT i.installationID, i.orderID, i.installationDate, i.installationStatus,
           c.customerName, o.orderDate, p.productName, od.subTotal
    FROM tblInstallation i
    JOIN tblOrder o ON i.orderID = o.orderID
    JOIN tblCustomer c ON o.customerID = c.customerID
    JOIN tblProduct p ON o.productID = p.productID
    JOIN tblOrderDetails od ON o.orderID = od.orderID
    WHERE i.installationStatus = 'Pending'
    ORDER BY i.installationID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

const markAsDone = (req, res) => {
  const { orderID } = req.body;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query("UPDATE tblInstallation SET installationStatus = 'Completed' WHERE installationID = ?", [req.params.id], (err) => {
      if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

      db.query("UPDATE tblOrder SET orderStatus = 'Completed' WHERE orderID = ?", [orderID], (err) => {
        if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

        db.query('SELECT subTotal FROM tblOrderDetails WHERE orderID = ?', [orderID], (err, details) => {
          if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

          const totalAmount = details[0]?.subTotal || 0;

          db.query('INSERT INTO tblSales (orderID, totalAmount) VALUES (?, ?)', [orderID, totalAmount], (err) => {
            if (err) return db.rollback(() => res.status(500).json({ error: err.message }));

            db.commit((err) => {
              if (err) return db.rollback(() => res.status(500).json({ error: err.message }));
              res.json({ message: 'Installation marked as done' });
            });
          });
        });
      });
    });
  });
};

module.exports = { getInstallations, markAsDone };
