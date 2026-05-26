const db = require('../config/db');

const getStats = (req, res) => {
  const queries = {
    totalOrders: 'SELECT COUNT(*) AS count FROM tblOrder',
    pendingOrders:
      "SELECT COUNT(*) AS count FROM tblOrder WHERE orderStatus = 'Pending'",
    forInstallation:
      "SELECT COUNT(*) AS count FROM tblOrder WHERE orderStatus = 'For Installation'",
    completedOrders:
      "SELECT COUNT(*) AS count FROM tblOrder WHERE orderStatus = 'Completed'",
    totalSales: 'SELECT COALESCE(SUM(totalAmount), 0) AS total FROM tblSales',
  };

  const results = {};
  const keys = Object.keys(queries);
  let done = 0;

  keys.forEach((key) => {
    db.query(queries[key], (err, rows) => {
      if (err) return res.status(500).json({ error: err.message });
      results[key] =
        key === 'totalSales' ? Number(rows[0].total) : rows[0].count;
      done++;
      if (done === keys.length) res.json(results);
    });
  });
};

const getChartData = (req, res) => {
  const dailySql = `
    SELECT DATE_FORMAT(o.orderDate, '%b %d') AS label,
           COALESCE(SUM(s.totalAmount), 0) AS total
    FROM tblSales s
    JOIN tblOrder o ON s.orderID = o.orderID
    WHERE o.orderDate >= DATE_SUB(CURDATE(), INTERVAL 10 DAY)
    GROUP BY o.orderDate, label
    ORDER BY o.orderDate ASC
    LIMIT 10
  `;

  const weeklySql = `
    SELECT CONCAT('Week ', WEEK(o.orderDate, 1) - WEEK(DATE_SUB(CURDATE(), INTERVAL 6 WEEK), 1) + 1) AS label,
           COALESCE(SUM(s.totalAmount), 0) AS total
    FROM tblSales s
    JOIN tblOrder o ON s.orderID = o.orderID
    WHERE o.orderDate >= DATE_SUB(CURDATE(), INTERVAL 6 WEEK)
    GROUP BY WEEK(o.orderDate, 1), label
    ORDER BY WEEK(o.orderDate, 1) ASC
    LIMIT 6
  `;

  db.query(dailySql, (err, dailyRows) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(weeklySql, (err, weeklyRows) => {
      if (err) return res.status(500).json({ error: err.message });

      res.json({
        daily: {
          labels: dailyRows.map((r) => r.label),
          data: dailyRows.map((r) => Number(r.total)),
        },
        weekly: {
          labels: weeklyRows.map((r) => r.label),
          data: weeklyRows.map((r) => Number(r.total)),
        },
      });
    });
  });
};

const getHistory = (req, res) => {
  const sql = `
    SELECT
      c.customerName AS name,
      p.productName AS product,
      od.subTotal AS totalAmount,
      o.orderStatus AS status,
      DATE_FORMAT(o.orderDate, '%b %d, %Y') AS date
    FROM tblOrder o
    JOIN tblCustomer c ON o.customerID = c.customerID
    JOIN tblProduct p ON o.productID = p.productID
    JOIN tblOrderDetails od ON o.orderID = od.orderID
    ORDER BY o.orderID DESC
    LIMIT 20
  `;
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

module.exports = { getStats, getChartData, getHistory };
