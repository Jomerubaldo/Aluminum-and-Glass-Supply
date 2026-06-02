CREATE DATABASE aluminum_and_glass_supply_sales_and_order_management_system_db;
USE aluminum_and_glass_supply_sales_and_order_management_system_db;

CREATE TABLE tblCustomer(
customerID INT AUTO_INCREMENT PRIMARY KEY,
customerName VARCHAR(99) NOT NULL,
phoneNumber VARCHAR(12) UNIQUE,
address VARCHAR(99) NOT NULL
);

CREATE TABLE tblProduct(
productID INT AUTO_INCREMENT PRIMARY KEY,
productName VARCHAR(99) NOT NULL UNIQUE,
price DECIMAL(10,2) NOT NULL
);

CREATE TABLE tblSupplier(
supplierID INT AUTO_INCREMENT PRIMARY KEY,
supplierName VARCHAR(99) UNIQUE NOT NULL,
contact VARCHAR(99) UNIQUE NOT NULL
);

CREATE TABLE tblMaterial(
materialID INT AUTO_INCREMENT PRIMARY KEY,
supplierID INT NOT NULL,
materialName VARCHAR(99) NOT NULL,
FOREIGN KEY(supplierID) REFERENCES tblSupplier(supplierID)
);

CREATE TABLE tblOrder(
orderID INT AUTO_INCREMENT PRIMARY KEY,
customerID INT NOT NULL,
productID INT NOT NULL,
orderDate DATE DEFAULT (CURRENT_DATE),
orderStatus VARCHAR(20) DEFAULT 'Pending',
requestType VARCHAR(10) DEFAULT 'AUTO',
height DECIMAL(10,2),
width DECIMAL(10,2),
specification TEXT,
FOREIGN KEY(customerID) REFERENCES tblCustomer(customerID),
FOREIGN KEY(productID) REFERENCES tblProduct(productID)
);

CREATE TABLE tblMaterialRequest(
requestID INT AUTO_INCREMENT PRIMARY KEY,
orderID INT NOT NULL,
materialName VARCHAR(100) NOT NULL,
requiredQty INT NOT NULL DEFAULT 1,
createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY(orderID) REFERENCES tblOrder(orderID) ON DELETE CASCADE
);

CREATE TABLE tblOrderDetails(
orderDetailsID INT AUTO_INCREMENT PRIMARY KEY,
orderID INT NOT NULL,
quantity INT NOT NULL,
subTotal DECIMAL(10,2) NOT NULL,
FOREIGN KEY(orderID) REFERENCES tblOrder(orderID)
);

CREATE TABLE tblInstallation(
installationID INT AUTO_INCREMENT PRIMARY KEY,
orderID INT NOT NULL UNIQUE,
installationDate DATE DEFAULT (CURRENT_DATE),
installationStatus VARCHAR(20) DEFAULT 'Pending',
FOREIGN KEY(orderID) REFERENCES tblOrder(orderID)
);

CREATE TABLE tblSales(
salesID INT AUTO_INCREMENT PRIMARY KEY,
orderID INT NOT NULL UNIQUE,
totalAmount DECIMAL(10,2) NOT NULL,
FOREIGN KEY(orderID) REFERENCES tblOrder(orderID)
);