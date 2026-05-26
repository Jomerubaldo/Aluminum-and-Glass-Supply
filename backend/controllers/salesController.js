const db = require('../config/db');

const getSales = (req, res) => {
  const sql = `
    SELECT s.salesID, c.customerName, p.productName,
           od.quantity, p.price, s.totalAmount, o.orderDate
    FROM tblSales s
    JOIN tblOrder o ON s.orderID = o.orderID
    JOIN tblCustomer c ON o.customerID = c.customerID
    JOIN tblProduct p ON o.productID = p.productID
    JOIN tblOrderDetails od ON o.orderID = od.orderID
    ORDER BY s.salesID DESC
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports = { getSales };
