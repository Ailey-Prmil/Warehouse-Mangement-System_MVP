-- Seed data for Warehouse Management System Database
-- This file contains initial seed data for the database
-- Disable foreign key checks temporarily for easier loading
SET FOREIGN_KEY_CHECKS = 0;
-- Clear existing data to avoid duplicates when rerunning
TRUNCATE TABLE Product;
TRUNCATE TABLE LocationBin;
TRUNCATE TABLE CustomerOrder;
TRUNCATE TABLE CustomerOrderDetail;
TRUNCATE TABLE InboundShipment;
TRUNCATE TABLE InboundShipmentDetail;
TRUNCATE TABLE OutboundShipment;
TRUNCATE TABLE PickingList;
TRUNCATE TABLE PurchaseOrder;
TRUNCATE TABLE PurchaseOrderDetail;
-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;
-- Seed Products (expanded with more categories)
INSERT INTO Product (ProductID, Name, SKU, UnitOfMeasure)
VALUES -- Tech products
    (1, 'Smartphone X1', 'TECH-SP-001', 'each'),
    (2, 'Laptop Pro 15"', 'TECH-LP-002', 'each'),
    (3, 'Wireless Headphones', 'TECH-WH-003', 'each'),
    (4, 'Smart Watch', 'TECH-SW-004', 'each'),
    (5, 'Power Bank 10000mAh', 'TECH-PB-005', 'each'),
    (6, 'USB-C Cable 2m', 'TECH-CB-006', 'each'),
    (7, 'Bluetooth Speaker', 'TECH-BS-007', 'each'),
    (8, 'Wireless Mouse', 'TECH-WM-008', 'each'),
    (9, 'External SSD 1TB', 'TECH-SSD-009', 'each'),
    (10, 'Wireless Keyboard', 'TECH-WK-010', 'each'),
    -- Office supplies
    (11, 'Printer Paper A4', 'OFF-PP-011', 'ream'),
    (
        12,
        'Ballpoint Pens (10pk)',
        'OFF-BP-012',
        'pack'
    ),
    (
        13,
        'Sticky Notes Assorted',
        'OFF-SN-013',
        'pack'
    ),
    (14, 'Stapler Metal', 'OFF-ST-014', 'each'),
    (15, 'Desk Organizer', 'OFF-DO-015', 'each'),
    -- Furniture
    (16, 'Office Chair Basic', 'FURN-OC-016', 'each'),
    (17, 'Standing Desk 120cm', 'FURN-SD-017', 'each'),
    (18, 'Bookshelf 5-Tier', 'FURN-BS-018', 'each'),
    (
        19,
        'Filing Cabinet Metal',
        'FURN-FC-019',
        'each'
    ),
    (20, 'Desk Lamp LED', 'FURN-DL-020', 'each'),
    -- Home goods
    (21, 'Bath Towel Set', 'HOME-BT-021', 'set'),
    (22, 'Kitchen Knife Set', 'HOME-KK-022', 'set'),
    (
        23,
        'Ceramic Dinner Plates (4pk)',
        'HOME-DP-023',
        'set'
    ),
    (24, 'Glass Tumbler Set', 'HOME-GT-024', 'set'),
    (
        25,
        'Stainless Steel Pot 5L',
        'HOME-SP-025',
        'each'
    );
-- Seed Location Bins (expanded with more locations)
INSERT INTO LocationBin (LocID, Aisle, Section, Shelf, Capacity)
VALUES -- Aisle A - Tech products
    (1, 'A1', 'S1', 'SH1', 100),
    (2, 'A1', 'S1', 'SH2', 150),
    (3, 'A1', 'S2', 'SH1', 120),
    (4, 'A1', 'S2', 'SH2', 120),
    (5, 'A2', 'S1', 'SH1', 200),
    (6, 'A2', 'S1', 'SH2', 200),
    (7, 'A2', 'S2', 'SH1', 150),
    (8, 'A2', 'S2', 'SH2', 150),
    (9, 'A3', 'S1', 'SH1', 180),
    (10, 'A3', 'S1', 'SH2', 180),
    -- Aisle B - Office supplies
    (11, 'B1', 'S1', 'SH1', 300),
    (12, 'B1', 'S1', 'SH2', 300),
    (13, 'B1', 'S2', 'SH1', 250),
    (14, 'B1', 'S2', 'SH2', 250),
    (15, 'B2', 'S1', 'SH1', 200),
    -- Aisle C - Furniture
    (16, 'C1', 'S1', 'SH1', 50),
    (17, 'C1', 'S2', 'SH1', 50),
    (18, 'C2', 'S1', 'SH1', 40),
    (19, 'C2', 'S2', 'SH1', 40),
    (20, 'C3', 'S1', 'SH1', 60),
    -- Aisle D - Home goods
    (21, 'D1', 'S1', 'SH1', 150),
    (22, 'D1', 'S1', 'SH2', 150),
    (23, 'D2', 'S1', 'SH1', 180),
    (24, 'D2', 'S1', 'SH2', 180),
    (25, 'D3', 'S1', 'SH1', 200);
-- Seed Customer Orders
INSERT INTO CustomerOrder (CustomerOrderID, Address, Status)
VALUES (
        1001,
        '123 Main St, Anytown, AN 12345',
        'Pending'
    ),
    (
        1002,
        '456 Oak Ave, Somewhere, SM 67890',
        'Pending'
    ),
    (
        1003,
        '789 Pine Rd, Elsewhere, EL 23456',
        'Pending'
    ),
    (
        1004,
        '101 Cedar Ln, Springfield, SP 34567',
        'Pending'
    ),
    (
        1005,
        '202 Maple Dr, Riverdale, RV 45678',
        'Pick and Pack'
    ),
    (
        1006,
        '303 Birch Blvd, Lakeside, LS 56789',
        'Pick and Pack'
    ),
    (
        1007,
        '404 Walnut Way, Mountain View, MV 67890',
        'Shipped'
    ),
    (1008, '505 Elm St, Seaside, SS 78901', 'Shipped'),
    (
        1009,
        '606 Pineapple Pl, Tropical, TP 89012',
        'Shipped'
    ),
    (
        1010,
        '707 Apple Ave, Orchard, OR 90123',
        'Pending'
    );
-- Seed CustomerOrderDetail (basic pending orders only, no need for shipped ones)
INSERT INTO CustomerOrderDetail (CustomerOrderID, ProductID, Quantity)
VALUES -- Order 1001
    (1001, 1, 2),
    -- 2 Smartphones
    (1001, 3, 1),
    -- 1 Wireless Headphones
    -- Order 1002
    (1002, 2, 1),
    -- 1 Laptop
    (1002, 8, 1),
    -- 1 Wireless Mouse
    (1002, 10, 1),
    -- 1 Wireless Keyboard
    -- Order 1003
    (1003, 21, 2),
    -- 2 Bath Towel Sets
    (1003, 22, 1),
    -- 1 Kitchen Knife Set
    -- Order 1004
    (1004, 16, 2),
    -- 2 Office Chairs
    (1004, 17, 1),
    -- 1 Standing Desk
    -- Order 1005
    (1005, 5, 3),
    -- 3 Power Banks
    (1005, 6, 5),
    -- 5 USB-C Cables
    -- Order 1010
    (1010, 11, 10),
    -- 10 Printer Paper A4
    (1010, 12, 5);
-- 5 Ballpoint Pens packs
-- Seed InboundShipment
INSERT INTO InboundShipment (ShipID)
VALUES (101),
    (102),
    (103),
    (104),
    (105),
    (106);
-- Seed InboundShipmentDetail (for received shipments)
INSERT INTO InboundShipmentDetail (ShipID, ProductID, ReceivedQuantity)
VALUES -- Shipment 101 - Tech products
    (101, 1, 20),
    -- 20 Smartphones
    (101, 2, 15),
    -- 15 Laptops
    (101, 3, 30),
    -- 30 Wireless Headphones
    -- Shipment 102 - More tech products
    (102, 4, 25),
    -- 25 Smart Watches
    (102, 5, 40),
    -- 40 Power Banks
    (102, 6, 100),
    -- 100 USB-C Cables
    -- Shipment 103 - Office supplies
    (103, 11, 200),
    -- 200 Printer Paper A4
    (103, 12, 150),
    -- 150 Ballpoint Pens packs
    (103, 13, 80),
    -- 80 Sticky Notes packs
    -- Shipment 104 - Furniture
    (104, 16, 10),
    -- 10 Office Chairs
    (104, 17, 8),
    -- 8 Standing Desks
    -- Shipment 105 - Home goods
    (105, 21, 30),
    -- 30 Bath Towel Sets
    (105, 22, 20),
    -- 20 Kitchen Knife Sets
    -- Shipment 106 - Mixed products
    (106, 7, 35),
    -- 35 Bluetooth Speakers
    (106, 14, 20);
-- 20 Staplers
-- Seed OutboundShipment
INSERT INTO OutboundShipment (ShipmentID, Carrier, TrackingNumber)
VALUES (201, 'FastShip', 'FS123456789'),
    (202, 'QuickDeliver', 'QD987654321'),
    (203, 'ExpressLogistics', 'EL567891234'),
    (204, 'SpeedyPost', 'SP456789123'),
    (205, 'Global Freight', 'GF789123456');
-- Seed PickingList
INSERT INTO PickingList (PicklistID, DoneAt)
VALUES (301, '2025-04-10 14:30:00'),
    (302, '2025-04-11 15:45:00'),
    (303, '2025-04-12 09:15:00'),
    (304, NULL),
    (305, NULL);
-- Seed PurchaseOrder
INSERT INTO PurchaseOrder (PO_ID, ShipID)
VALUES (401, 101),
    (402, 102),
    (403, 103),
    (404, 104),
    (405, 105);
-- Seed PurchaseOrderDetail
INSERT INTO PurchaseOrderDetail (PO_ID, ProductID, OrderedQuantity)
VALUES -- PO 401 details
    (401, 1, 25),
    -- 25 Smartphones
    (401, 2, 20),
    -- 20 Laptops
    (401, 3, 40),
    -- 40 Wireless Headphones
    -- PO 402 details
    (402, 4, 30),
    -- 30 Smart Watches
    (402, 5, 50),
    -- 50 Power Banks
    (402, 6, 120),
    -- 120 USB-C Cables
    -- PO 403 details
    (403, 11, 250),
    -- 250 Printer Paper A4
    (403, 12, 200),
    -- 200 Ballpoint Pens packs
    (403, 13, 100),
    -- 100 Sticky Notes packs
    -- PO 404 details
    (404, 16, 15),
    -- 15 Office Chairs
    (404, 17, 10),
    -- 10 Standing Desks
    -- PO 405 details
    (405, 21, 40),
    -- 40 Bath Towel Sets
    (405, 22, 25);
-- 25 Kitchen Knife Sets
-- Carefully add some StockTransactions to populate the Stock table
-- These need to comply with capacity constraints
-- Store transactions for tech products in tech locations
INSERT INTO StockTransaction (ProductID, LocID, TransactionType, Quantity)
VALUES -- Smartphones in Aisle A
    (1, 1, 'Store', 10),
    -- Laptops in Aisle A
    (2, 2, 'Store', 8),
    -- Wireless Headphones in Aisle A
    (3, 3, 'Store', 15),
    -- Smart Watches in Aisle A
    (4, 4, 'Store', 12),
    -- Power Banks in Aisle A
    (5, 5, 'Store', 20),
    -- USB-C Cables in Aisle A
    (6, 6, 'Store', 50),
    -- Office supplies in Aisle B
    (11, 11, 'Store', 100),
    (12, 12, 'Store', 75),
    (13, 13, 'Store', 40),
    -- Furniture in Aisle C
    (16, 16, 'Store', 5),
    (17, 17, 'Store', 4),
    -- Home goods in Aisle D
    (21, 21, 'Store', 15),
    (22, 22, 'Store', 10);
-- Note on remaining tables:
-- The following tables are populated through transactions or are transactional in nature:
-- 1. Stock - populated by the above StockTransaction entries via triggers
-- 2. OrderTransaction - depends on order processing flow
-- 3. Inspection - depends on quality control processes
-- These tables should be populated through application logic when testing specific features.