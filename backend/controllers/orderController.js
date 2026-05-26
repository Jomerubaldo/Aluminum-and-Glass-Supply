// const db = require('../config/db');

// const getOrders = (req, res) => {
//   const sql = `
//     SELECT o.orderID, c.customerName, p.productName, p.price,
//            o.orderDate, o.orderStatus, o.requestType,
//            o.height, o.width, o.specification,
//            od.quantity, od.subTotal
//     FROM tblOrder o
//     JOIN tblCustomer c ON o.customerID = c.customerID
//     JOIN tblProduct p ON o.productID = p.productID
//     JOIN tblOrderDetails od ON o.orderID = od.orderID
//     ORDER BY o.orderID DESC
//   `;
//   db.query(sql, (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json(results);
//   });
// };

// const getOrderById = (req, res) => {
//   const sql = `
//     SELECT o.orderID, c.customerName, p.productName, p.price,
//            o.orderDate, o.orderStatus, o.requestType,
//            o.height, o.width, o.specification,
//            od.quantity, od.subTotal
//     FROM tblOrder o
//     JOIN tblCustomer c ON o.customerID = c.customerID
//     JOIN tblProduct p ON o.productID = p.productID
//     JOIN tblOrderDetails od ON o.orderID = od.orderID
//     WHERE o.orderID = ?
//   `;
//   db.query(sql, [req.params.id], (err, results) => {
//     if (err) return res.status(500).json({ error: err.message });
//     if (results.length === 0)
//       return res.status(404).json({ error: 'Order not found' });
//     res.json(results[0]);
//   });
// };

// const createOrder = (req, res) => {
//   const {
//     customerID,
//     productID,
//     quantity,
//     height,
//     width,
//     specification,
//     requestType,
//     price,
//   } = req.body;
//   const subTotal = price * quantity;

//   db.beginTransaction((err) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const orderSql = `
//       INSERT INTO tblOrder (customerID, productID, orderStatus, requestType, height, width, specification)
//       VALUES (?, ?, 'Pending', ?, ?, ?, ?)
//     `;
//     db.query(
//       orderSql,
//       [
//         customerID,
//         productID,
//         requestType,
//         height || null,
//         width || null,
//         specification || null,
//       ],
//       (err, orderResult) => {
//         if (err)
//           return db.rollback(() =>
//             res.status(500).json({ error: err.message })
//           );

//         const orderID = orderResult.insertId;

//         db.query(
//           'INSERT INTO tblOrderDetails (orderID, quantity, subTotal) VALUES (?, ?, ?)',
//           [orderID, quantity, subTotal],
//           (err) => {
//             if (err)
//               return db.rollback(() =>
//                 res.status(500).json({ error: err.message })
//               );

//             db.query(
//               "INSERT INTO tblInstallation (orderID, installationStatus) VALUES (?, 'Pending')",
//               [orderID],
//               (err) => {
//                 if (err)
//                   return db.rollback(() =>
//                     res.status(500).json({ error: err.message })
//                   );

//                 db.commit((err) => {
//                   if (err)
//                     return db.rollback(() =>
//                       res.status(500).json({ error: err.message })
//                     );
//                   res.json({ message: 'Order created successfully', orderID });
//                 });
//               }
//             );
//           }
//         );
//       }
//     );
//   });
// };

// const updateOrder = (req, res) => {
//   const {
//     customerID,
//     productID,
//     quantity,
//     height,
//     width,
//     specification,
//     requestType,
//     price,
//   } = req.body;
//   const subTotal = price * quantity;

//   db.beginTransaction((err) => {
//     if (err) return res.status(500).json({ error: err.message });

//     const orderSql = `
//       UPDATE tblOrder SET customerID = ?, productID = ?, requestType = ?,
//       height = ?, width = ?, specification = ? WHERE orderID = ?
//     `;
//     db.query(
//       orderSql,
//       [
//         customerID,
//         productID,
//         requestType,
//         height || null,
//         width || null,
//         specification || null,
//         req.params.id,
//       ],
//       (err) => {
//         if (err)
//           return db.rollback(() =>
//             res.status(500).json({ error: err.message })
//           );

//         db.query(
//           'UPDATE tblOrderDetails SET quantity = ?, subTotal = ? WHERE orderID = ?',
//           [quantity, subTotal, req.params.id],
//           (err) => {
//             if (err)
//               return db.rollback(() =>
//                 res.status(500).json({ error: err.message })
//               );

//             db.commit((err) => {
//               if (err)
//                 return db.rollback(() =>
//                   res.status(500).json({ error: err.message })
//                 );
//               res.json({ message: 'Order updated successfully' });
//             });
//           }
//         );
//       }
//     );
//   });
// };

// const deleteOrder = (req, res) => {
//   db.query('DELETE FROM tblOrder WHERE orderID = ?', [req.params.id], (err) => {
//     if (err) return res.status(500).json({ error: err.message });
//     res.json({ message: 'Order deleted successfully' });
//   });
// };

// const markAsCompleted = (req, res) => {
//   db.query(
//     "UPDATE tblOrder SET orderStatus = 'For Installation' WHERE orderID = ?",
//     [req.params.id],
//     (err) => {
//       if (err) return res.status(500).json({ error: err.message });
//       res.json({ message: 'Order marked as For Installation' });
//     }
//   );
// };

// module.exports = {
//   getOrders,
//   getOrderById,
//   createOrder,
//   updateOrder,
//   deleteOrder,
//   markAsCompleted,
// };

const db = require('../config/db');

const MATERIAL_SUGGESTIONS = {
  'Aluminum Sliding Window': [
    { materialName: 'Aluminum Frame', requiredQty: 2 },
    { materialName: 'Aluminum Channel', requiredQty: 4 },
    { materialName: 'Clear Glass Panel', requiredQty: 2 },
    { materialName: 'Rubber Seal', requiredQty: 3 },
    { materialName: 'Sliding Roller', requiredQty: 4 },
    { materialName: 'Silicone Sealant', requiredQty: 2 },
  ],

  'Aluminum Casement Window': [
    { materialName: 'Aluminum Frame', requiredQty: 1 },
    { materialName: 'Aluminum Channel', requiredQty: 2 },
    { materialName: 'Clear Glass Panel', requiredQty: 1 },
    { materialName: 'Rubber Seal', requiredQty: 2 },
    { materialName: 'Door Lock Set', requiredQty: 1 },
  ],

  'Sliding Glass Door': [
    { materialName: 'Aluminum Frame', requiredQty: 2 },
    { materialName: 'Aluminum Channel', requiredQty: 4 },
    { materialName: 'Clear Glass Panel', requiredQty: 2 },
    { materialName: 'Sliding Roller', requiredQty: 4 },
    { materialName: 'Door Lock Set', requiredQty: 1 },
  ],

  'Frameless Glass Door': [
    { materialName: 'Tempered Glass Panel', requiredQty: 1 },
    { materialName: 'Glass Clamp', requiredQty: 4 },
    { materialName: 'Door Lock Set', requiredQty: 1 },
  ],

  'Glass Partition': [
    { materialName: 'Clear Glass Panel', requiredQty: 2 },
    { materialName: 'Aluminum Frame', requiredQty: 2 },
    { materialName: 'Silicone Sealant', requiredQty: 2 },
  ],
};

const getOrders = (req, res) => {
  const sql = `
    SELECT o.orderID, c.customerName, p.productName, p.price,
           o.orderDate, o.orderStatus, o.requestType,
           o.height, o.width, o.specification,
           od.quantity, od.subTotal
    FROM tblOrder o
    JOIN tblCustomer c ON o.customerID = c.customerID
    JOIN tblProduct p ON o.productID = p.productID
    JOIN tblOrderDetails od ON o.orderID = od.orderID
    ORDER BY o.orderID DESC
  `;

  db.query(sql, (err, orders) => {
    if (err) return res.status(500).json({ error: err.message });

    if (!orders.length) return res.json([]);

    const ids = orders.map((o) => o.orderID);

    db.query(
      'SELECT * FROM tblMaterialRequest WHERE orderID IN (?)',
      [ids],
      (err, materials) => {
        if (err) return res.status(500).json({ error: err.message });

        const grouped = {};

        materials.forEach((m) => {
          if (!grouped[m.orderID]) grouped[m.orderID] = [];

          grouped[m.orderID].push(m);
        });

        const finalData = orders.map((order) => ({
          ...order,
          materials: grouped[order.orderID] || [],
        }));

        res.json(finalData);
      }
    );
  });
};

const getOrderById = (req, res) => {
  const sql = `
    SELECT o.orderID, c.customerName, p.productName, p.price,
           o.orderDate, o.orderStatus, o.requestType,
           o.height, o.width, o.specification,
           od.quantity, od.subTotal
    FROM tblOrder o
    JOIN tblCustomer c ON o.customerID = c.customerID
    JOIN tblProduct p ON o.productID = p.productID
    JOIN tblOrderDetails od ON o.orderID = od.orderID
    WHERE o.orderID = ?
  `;
  db.query(sql, [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ error: 'Order not found' });
    res.json(results[0]);
  });
};

const createOrder = (req, res) => {
  const {
    customerID,
    productID,
    quantity,
    height,
    width,
    specification,
    requestType,
    price,
    productName,
  } = req.body;

  const subTotal = price * quantity;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    const orderSql = `
      INSERT INTO tblOrder
      (customerID, productID, orderStatus, requestType, height, width, specification)
      VALUES (?, ?, 'Pending', ?, ?, ?, ?)
    `;

    db.query(
      orderSql,
      [
        customerID,
        productID,
        requestType,
        height || null,
        width || null,
        specification || null,
      ],
      (err, orderResult) => {
        if (err)
          return db.rollback(() =>
            res.status(500).json({ error: err.message })
          );

        const orderID = orderResult.insertId;

        db.query(
          'INSERT INTO tblOrderDetails (orderID, quantity, subTotal) VALUES (?, ?, ?)',
          [orderID, quantity, subTotal],
          (err) => {
            if (err)
              return db.rollback(() =>
                res.status(500).json({ error: err.message })
              );

            if (requestType === 'AUTO') {
              const materials = MATERIAL_SUGGESTIONS[productName] || [];

              if (materials.length) {
                const values = materials.map((m) => [
                  orderID,
                  m.materialName,
                  m.requiredQty,
                ]);

                db.query(
                  'INSERT INTO tblMaterialRequest(orderID,materialName,requiredQty) VALUES ?',
                  [values],
                  finish
                );
              } else {
                finish();
              }
            } else {
              finish();
            }

            function finish() {
              db.commit((err) => {
                if (err)
                  return db.rollback(() =>
                    res.status(500).json({ error: err.message })
                  );

                res.json({
                  message: 'Order created successfully',
                  orderID,
                });
              });
            }
          }
        );
      }
    );
  });
};

const updateOrder = (req, res) => {
  const {
    customerID,
    productID,
    quantity,
    height,
    width,
    specification,
    requestType,
    price,
  } = req.body;
  const subTotal = price * quantity;

  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    const orderSql = `
      UPDATE tblOrder SET customerID = ?, productID = ?, requestType = ?,
      height = ?, width = ?, specification = ? WHERE orderID = ?
    `;
    db.query(
      orderSql,
      [
        customerID,
        productID,
        requestType,
        height || null,
        width || null,
        specification || null,
        req.params.id,
      ],
      (err) => {
        if (err)
          return db.rollback(() =>
            res.status(500).json({ error: err.message })
          );

        db.query(
          'UPDATE tblOrderDetails SET quantity = ?, subTotal = ? WHERE orderID = ?',
          [quantity, subTotal, req.params.id],
          (err) => {
            if (err)
              return db.rollback(() =>
                res.status(500).json({ error: err.message })
              );

            db.commit((err) => {
              if (err)
                return db.rollback(() =>
                  res.status(500).json({ error: err.message })
                );
              res.json({ message: 'Order updated successfully' });
            });
          }
        );
      }
    );
  });
};

const deleteOrder = (req, res) => {
  db.query('DELETE FROM tblOrder WHERE orderID = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Order deleted successfully' });
  });
};

const markAsCompleted = (req, res) => {
  db.beginTransaction((err) => {
    if (err) return res.status(500).json({ error: err.message });

    db.query(
      "UPDATE tblOrder SET orderStatus = 'For Installation' WHERE orderID = ?",
      [req.params.id],
      (err) => {
        if (err)
          return db.rollback(() =>
            res.status(500).json({ error: err.message })
          );

        db.query(
          "INSERT INTO tblInstallation (orderID, installationStatus) VALUES (?, 'Pending')",
          [req.params.id],
          (err) => {
            if (err)
              return db.rollback(() =>
                res.status(500).json({ error: err.message })
              );

            db.commit((err) => {
              if (err)
                return db.rollback(() =>
                  res.status(500).json({ error: err.message })
                );
              res.json({ message: 'Order marked as For Installation' });
            });
          }
        );
      }
    );
  });
};

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder,
  markAsCompleted,
};
