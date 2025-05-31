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
INSERT INTO Product (ProductID, Name, SKU, UnitOfMeasure, CreatedAt)
VALUES
-- Tech products
(1, 'Smartphone X1', 'TECH-SP-001', 'each', '2023-11-10 08:30:00'),
(2, 'Laptop Pro 15"', 'TECH-LP-002', 'each', '2023-12-05 10:15:00'),
(3, 'Wireless Headphones', 'TECH-WH-003', 'each', '2024-01-20 09:00:00'),
(4, 'Smart Watch', 'TECH-SW-004', 'each', '2024-02-14 14:45:00'),
(5, 'Power Bank 10000mAh', 'TECH-PB-005', 'each', '2024-03-01 11:00:00'),
(6, 'USB-C Cable 2m', 'TECH-CB-006', 'each', '2024-03-15 13:30:00'),
(7, 'Bluetooth Speaker', 'TECH-BS-007', 'each', '2024-04-01 16:00:00'),
(8, 'Wireless Mouse', 'TECH-WM-008', 'each', '2024-04-15 17:45:00'),
(9, 'External SSD 1TB', 'TECH-SSD-009', 'each', '2024-04-20 09:20:00'),
(10, 'Wireless Keyboard', 'TECH-WK-010', 'each', '2024-04-25 12:10:00'),

-- Office supplies
(11, 'Printer Paper A4', 'OFF-PP-011', 'ream', '2024-03-10 08:30:00'),
(12, 'Ballpoint Pens (10pk)', 'OFF-BP-012', 'pack', '2024-03-12 09:45:00'),
(13, 'Sticky Notes Assorted', 'OFF-SN-013', 'pack', '2024-03-13 11:20:00'),
(14, 'Stapler Metal', 'OFF-ST-014', 'each', '2024-03-18 10:00:00'),
(15, 'Desk Organizer', 'OFF-DO-015', 'each', '2024-03-22 13:00:00'),

-- Furniture
(16, 'Office Chair Basic', 'FURN-OC-016', 'each', '2023-10-05 08:00:00'),
(17, 'Standing Desk 120cm', 'FURN-SD-017', 'each', '2023-10-10 14:30:00'),
(18, 'Bookshelf 5-Tier', 'FURN-BS-018', 'each', '2023-10-15 15:45:00'),
(19, 'Filing Cabinet Metal', 'FURN-FC-019', 'each', '2023-10-20 09:10:00'),
(20, 'Desk Lamp LED', 'FURN-DL-020', 'each', '2023-10-25 16:50:00'),

-- Home goods
(21, 'Bath Towel Set', 'HOME-BT-021', 'set', '2023-12-01 10:00:00'),
(22, 'Kitchen Knife Set', 'HOME-KK-022', 'set', '2023-12-05 11:30:00'),
(23, 'Ceramic Dinner Plates (4pk)', 'HOME-DP-023', 'set', '2023-12-10 12:00:00'),
(24, 'Glass Tumbler Set', 'HOME-GT-024', 'set', '2023-12-15 13:20:00'),
(25, 'Stainless Steel Pot 5L', 'HOME-SP-025', 'each', '2023-12-20 14:45:00');

-- Seed Location Bins (expanded with more locations)
INSERT INTO LocationBin (LocID, Aisle, Section, Shelf, Capacity)
VALUES -- Aisle A - Tech products
    (1, 'A1', 'S1', 'SH1', 3000),
    (2, 'A1', 'S1', 'SH2', 3000),
    (3, 'A1', 'S2', 'SH1', 2000),
    (4, 'A1', 'S2', 'SH2', 2000),
    (5, 'A2', 'S1', 'SH1', 1000),
    (6, 'A2', 'S1', 'SH2', 1000),
    (7, 'A2', 'S2', 'SH1', 5000),
    (8, 'A2', 'S2', 'SH2', 5000),
    (9, 'A3', 'S1', 'SH1', 5000),
    (10, 'A3', 'S1', 'SH2', 5000),
    -- Aisle B - Office supplies
    (11, 'B1', 'S1', 'SH1', 3000),
    (12, 'B1', 'S1', 'SH2', 3000),
    (13, 'B1', 'S2', 'SH1', 2500),
    (14, 'B1', 'S2', 'SH2', 2500),
    (15, 'B2', 'S1', 'SH1', 2000),
    -- Aisle C - Furniture
    (16, 'C1', 'S1', 'SH1', 1000),
    (17, 'C1', 'S2', 'SH1', 1000),
    (18, 'C2', 'S1', 'SH1', 1000),
    (19, 'C2', 'S2', 'SH1', 1000),
    (20, 'C3', 'S1', 'SH1', 1000),
    -- Aisle D - Home goods
    (21, 'D1', 'S1', 'SH1', 1000),
    (22, 'D1', 'S1', 'SH2', 1000),
    (23, 'D2', 'S1', 'SH1', 1000),
    (24, 'D2', 'S1', 'SH2', 1000),
    (25, 'D3', 'S1', 'SH1', 1000);
-- Seed Customer Orders
INSERT INTO CustomerOrder (CustomerOrderID, OrderTime, Address, Status)
VALUES
(1001, '2024-12-15 10:30:00', '123 Le Loi, District 1, HCM', 'Shipped'),
(1002, '2025-01-02 14:45:00', '45 Tran Phu, Nha Trang', 'Shipped'),
(1003, '2025-01-10 09:15:00', '76 Nguyen Hue, HCM', 'Shipped'),
(1004, '2025-01-15 16:00:00', '12 Dien Bien Phu, Hanoi', 'Shipped'),
(1005, '2025-01-18 08:20:00', '99 Ly Thuong Kiet, Hanoi', 'Shipped'),
(1006, '2025-01-20 13:10:00', '77 Cach Mang Thang 8, HCM', 'Pick and Pack'),
(1007, '2025-01-25 18:45:00', '234 Hoang Dieu, Da Nang', 'Pick and Pack'),
(1008, '2025-01-28 10:00:00', '321 Lac Long Quan, HCM', 'Pick and Pack'),
(1009, '2025-01-30 11:30:00', '54 Pasteur, HCM', 'Pick and Pack'),
(1010, '2025-02-01 15:00:00', '23 Pham Van Dong, Hanoi', 'Pending'),
(1011, '2025-02-03 17:25:00', '45 Vo Thi Sau, HCM', 'Pending'),
(1012, '2025-02-05 09:00:00', '88 Nguyen Van Linh, Đà Nẵng', 'Pending'),
(1013, '2025-02-07 13:40:00', '66 Nguyen Trai, Hanoi', 'Pending'),
(1014, '2025-02-10 08:15:00', '91 Truong Chinh, Hanoi', 'Pending'),
(1015, '2025-02-12 16:20:00', '17 Hai Ba Trung, HCM', 'Pending'),
(1016, '2025-02-14 14:35:00', '129 Nguyen Thi Minh Khai, HCM', 'Pending'),
(1017, '2025-02-16 10:45:00', '39 Huynh Thuc Khang, Hanoi', 'Pending'),
(1018, '2025-02-18 12:00:00', '77 Nguyen Khanh Toan, Hanoi', 'Pending'),
(1019, '2025-02-20 13:50:00', '23 Tran Hung Dao, Hai Phong', 'Pending'),
(1020, '2025-02-22 11:25:00', '159 Nguyen Van Cu, HCM', 'Pending'),
(1021, '2025-02-25 15:10:00', '19 Hung Vuong, Hue', 'Pending'),
(1022, '2025-02-28 10:40:00', '67 Nam Ky Khoi Nghia, HCM', 'Pending');

-- Seed CustomerOrderDetail (basic pending orders only, no need for shipped ones)
INSERT INTO CustomerOrderDetail (CustomerOrderID, ProductID, Quantity)
VALUES
(1001, 1, 20),
(1001, 5, 12),
(1001, 14, 20),
(1001, 15, 15),

(1002, 3, 12),
(1002, 11, 30),
(1002, 25, 12),

(1003, 1, 20),
(1003, 9, 20),
(1003, 12, 20),
(1003, 14, 30),
(1003, 18, 12),
(1003, 25, 12),

(1004, 20, 10),
(1004, 21, 10),
(1004, 23, 10),
(1004, 24, 10),

(1005, 14, 20),

(1006, 7, 10),
(1006, 2, 20),

(1007, 19, 10),

(1008, 4, 30),
(1008, 13, 10),

(1009, 9, 20),
(1009, 19, 20),
(1009, 20, 20),
(1009, 21, 20),
(1009, 22, 20),
(1009, 23, 20),
(1009, 24, 20),

(1010, 10, 10),
(1010, 12, 10),
(1010, 14, 10),

(1011, 6, 30),

(1012, 17, 10),

(1013, 21, 20),
(1013, 23, 20),

(1014, 23, 10),

(1015, 15, 40),
(1015, 16, 40),
(1015, 17, 40),

(1016, 12, 20),
(1016, 13, 20),

(1017, 25, 10),

(1018, 18, 10),
(1018, 19, 10),

(1019, 22, 20),
(1019, 23, 20),
(1019, 24, 20),

(1020, 1, 30),
(1020, 2, 30),

(1021, 3, 12),
(1021, 4, 12),
(1021, 5, 12),

(1022, 16, 12),
(1022, 17, 12),
(1022, 19, 12);

-- Seed InboundShipment
INSERT INTO InboundShipment (ShipmentID, ShipmentTime)
VALUES
(101, '2025-01-23 11:06:22'),
(102, '2025-01-16 06:13:22'),
(103, '2024-12-25 21:24:40'),
(104, '2024-12-31 08:06:34'),
(105, '2024-12-24 22:44:08'),
(106, '2024-12-15 09:44:34');

-- Seed InboundShipmentDetail (for received shipments)
INSERT INTO InboundShipmentDetail (ShipmentID, ProductID, ReceivedQuantity)
VALUES 
    -- Shipment 101 - Tech products
    (101, 1, 2000),
    (101, 2, 2500),
    (101, 3, 3000),

    -- Shipment 102 - More tech products
    (102, 4, 2500),
    (102, 5, 4000),
    (102, 6, 1000),
    (102, 7, 1000),
    (102, 8, 1000),
    (102, 9, 1000),
    (102, 10, 1000),

    -- Shipment 103 - Office supplies
    (103, 11, 2000),
    (103, 12, 1500),
    (103, 13, 800),
    (103, 14, 1000),

    -- Shipment 104 - Furniture
    (104, 15, 100),
    (104, 16, 100),
    (104, 17, 100),
    (104, 18, 100),
    (104, 19, 80),
    (104, 20, 80),

    -- Shipment 105 - Home goods
    (105, 19, 100),
    (105, 20, 100),
    (105, 21, 200),
    (105, 22, 200),
    (105, 23, 200),
    (105, 24, 200),
    (105, 25, 200),

    -- Shipment 106 - Mixed products
    (106, 7, 350),
    (106, 8, 350),
    (106, 9, 350);

-- Seed OutboundShipment
INSERT INTO OutboundShipment (ShipmentID, Carrier, TrackingNumber)
VALUES 
    (201, 'FastShip', 'FS123456789'),
    (202, 'QuickDeliver', 'QD987654321');
-- Seed PickingList
INSERT INTO PickingList (PicklistID, DoneAt)
VALUES 
    (301, '2025-05-1 14:30:00'),
    (302, '2025-05-1 15:45:00'),
    (303, NULL),
    (304, NULL);
-- Seed PurchaseOrder
INSERT INTO PurchaseOrder (PO_ID, ShipmentID)
VALUES 
    (401, 101), (402, 101), (403, 101), (404, 101), (405, 101),
    (406, 102), (407, 102), (408, 102), (409, 102), (410, 102),
    (411, 103), (412, 103), (413, 103), (414, 103), (415, 103),
    (416, 104), (417, 104), (418, 104), (419, 104), (420, 104),
    (421, 105), (422, 105), (423, 105), (424, 105), (425, 105),
    (426, 106), (427, 106), (428, 106), (429, 106), (430, 106);

-- Seed PurchaseOrderDetail
INSERT INTO PurchaseOrderDetail (PO_ID, ProductID, OrderedQuantity)
VALUES 
    -- within shipment 101
    (401, 1, 250), (401, 2, 200), (401, 3, 300),
    (402, 1, 750), (402, 2, 500), (402, 3, 900),
    (403, 1, 500), (403, 2, 300), (403, 3, 600),
    (404, 1, 250), (404, 2, 900), (404, 3, 900),
    (405, 1, 250), (405, 2, 600), (405, 3, 300),
    -- within shipment 102
    (406, 4, 300), (406, 5, 800), (406, 6, 100), (406, 7, 100), (406, 8, 200), (406, 9, 100), (406, 10, 500),
    (407, 4, 500), (407, 5, 1000), (407, 6, 200), (407, 7, 200), (407, 8, 200), (407, 9, 200), (407, 10, 100),
    (408, 4, 500), (408, 5, 900), (408, 6, 200), (408, 7, 100), (408, 8, 100), (408, 9, 400), (408, 10, 200),
    (409, 4, 600), (409, 5, 300), (409, 6, 300), (409, 7, 200), (409, 8, 100), (409, 9, 100), (409, 10, 100),
    (410, 4, 600), (410, 5, 1000), (410, 6, 200), (410, 7, 400), (410, 8, 400), (410, 9, 200), (410, 10, 100),
    -- within shipment 103
    (411, 11, 500), (411, 12, 200), (411, 13, 100), (411, 14, 200),
    (412, 11, 500), (412, 12, 400), (412, 13, 150), (412, 14, 200),
    (413, 11, 250), (413, 12, 100), (413, 13, 150), (413, 14, 200),
    (414, 11, 250), (414, 12, 300), (414, 13, 300), (414, 14, 200),
    (415, 11, 500), (415, 12, 500), (415, 13, 100), (415, 14, 200),
    -- within shipment 104
    (416, 15, 20), (416, 16, 25), (416, 17, 30), (416, 18, 20), (416, 19, 20), (416, 20, 20),
    (417, 15, 10), (417, 16, 10), (417, 17, 10), (417, 18, 20), (417, 19, 20), (417, 20, 20),
    (418, 15, 20), (418, 16, 10), (418, 17, 10), (418, 18, 20), (418, 19, 15), (418, 20, 10),
    (419, 15, 10), (419, 16, 25), (419, 17, 20), (419, 18, 20), (419, 19, 10), (419, 20, 15),
    (420, 15, 20), (420, 16, 30), (420, 17, 30), (420, 18, 20), (420, 19, 15), (420, 20, 15),
    -- within shipment 105
    (421, 19, 30), (421, 20, 25), (421, 21, 10), (421, 22, 25), (421, 23, 100), (421, 24, 70), (421, 25, 50),
    (422, 19, 30), (422, 20, 25), (422, 21, 150), (422, 22, 50), (422, 23, 25), (422, 24, 20), (422, 25, 50),
    (423, 19, 10), (423, 20, 10), (423, 21, 20), (423, 22, 35), (423, 23, 45), (423, 24, 30), (423, 25, 35),
    (424, 19, 20), (424, 20, 20), (424, 21, 10), (424, 22, 50), (424, 23, 20), (424, 24, 50), (424, 25, 55),
    (425, 19, 10), (425, 20, 20), (425, 21, 10), (425, 22, 40), (425, 23, 10), (425, 24, 30), (425, 25, 10),
    -- within shipment 106
    (426, 7, 10), (426, 8, 20), (426, 9, 150),
    (427, 7, 50), (427, 8, 20), (427, 9, 50),
    (428, 7, 100), (428, 8, 90), (428, 9, 50),
    (429, 7, 100), (429, 8, 100), (429, 9, 50),
    (430, 7, 90), (430, 8, 20), (430, 9, 50)
;
    
-- Store transactions for tech products in tech locations
INSERT INTO StockTransaction (ProductID, LocID, TransactionType, Quantity)
VALUES 
    -- Smartphones in Aisle A
    -- Storing product from inbound shipment 101 and 102 (full 8 stock positions)
    (1, 1, 'Store', 1000),
    (2, 1, 'Store', 500),
    (2, 3, 'Store', 2000),
    (3, 4, 'Store', 2000),
    (3, 5, 'Store', 500),
    (3, 6, 'Store', 500),
    (4, 2, 'Store', 1500),
    (4, 7, 'Store', 1000),
    (5, 7, 'Store', 4000),
    (6, 8, 'Store', 1000),
    (7, 8, 'Store', 1000),
    (8, 8, 'Store', 1000),
    (9, 8, 'Store', 1000),
    (10, 8, 'Store', 1000),
    -- Office Supplies in Aisle B
    -- Storing product from inbound shipment 103, 104, 105
    (11, 15, 'Store', 2000),
    (12, 14, 'Store', 1500),
    (13, 13, 'Store', 800),
    (14, 14, 'Store', 1000),
    (15, 13, 'Store', 100),
    -- Furniture in Aisle C
    (16, 16, 'Store', 100),
    (17, 16, 'Store', 100),
    (18, 16, 'Store', 100),
    (19, 16, 'Store', 180),
    (20, 16, 'Store', 180),
    -- Home goods in Aisle D
    (21, 21, 'Store', 200),
    (22, 22, 'Store', 200),
    (23, 23, 'Store', 200),
    (24, 24, 'Store', 200),
    (25, 25, 'Store', 200),
    -- Storing product from inbound shipment 106
    (7, 9, 'Store', 350),
    (8, 9, 'Store', 350),
    (9, 9, 'Store', 350)
;

INSERT INTO StockTransaction(ProductID, LocID, TransactionType, Quantity, RefID)
VALUES
    -- pick for picklist 301
    (1, 1, 'Pick', 40, 301),
    (3, 5, 'Pick', 12, 301),
    (5, 7, 'Pick', 12, 301),
    (9, 8, 'Pick', 20, 301),
    (11, 15, 'Pick', 30, 301),
    (12, 14, 'Pick', 20, 301),
    (14, 14, 'Pick', 70, 301),
    (15, 13, 'Pick', 15, 301),
    (18, 16, 'Pick', 12, 301),
    (20, 16, 'Pick', 10, 301),
    (21, 21, 'Pick', 10, 301),
    (23, 23, 'Pick', 10, 301),
    (24, 24, 'Pick', 10, 301),
    (25, 25, 'Pick', 24, 301),
    -- pick for picklist 301
    (2, 1, 'Pick', 20, 302),
    (4, 2, 'Pick', 30, 302),
    (7, 8, 'Pick', 10, 302),
    (9, 8, 'Pick', 20, 302),
    (13, 13, 'Pick', 10, 302),
    (14, 14, 'Pick', 20, 302),
    (19, 16, 'Pick', 30, 302),
    (20, 16, 'Pick', 20, 302),
    (21, 21, 'Pick', 20, 302),
    (22, 22, 'Pick', 20, 302),
    (23, 23, 'Pick', 20, 302),
    (24, 24, 'Pick', 20, 302)
;

INSERT INTO OrderTransaction(CustomerOrderID, RefID, TransactionTime, TransactionType)
VALUES 
    (1001, 301, '2025-05-1 14:30:00', 'Pick and Pack'),
    (1001, 201, '2025-05-2 14:30:00', 'Ship'),
    (1002, 301, '2025-05-1 14:30:00', 'Pick and Pack'),
    (1002, 201, '2025-05-2 14:30:00', 'Ship'),
    (1003, 301, '2025-05-1 14:30:00', 'Pick and Pack'),
    (1003, 201, '2025-05-2 14:30:00', 'Ship'),

    (1004, 301, '2025-05-1 14:30:00', 'Pick and Pack'),
    (1004, 202, '2025-05-2 13:30:00', 'Ship'),
    (1005, 301, '2025-05-1 14:30:00', 'Pick and Pack'),
    (1005, 202, '2025-05-2 13:30:00', 'Ship'),

    (1006, 302, '2025-05-1 15:45:00', 'Pick and Pack'),
    (1007, 302, '2025-05-1 15:45:00', 'Pick and Pack'),
    (1008, 302, '2025-05-1 15:45:00', 'Pick and Pack'),
    (1009, 302, '2025-05-1 15:45:00', 'Pick and Pack')
;

INSERT INTO Inspection (StockID, InspectTime, DefectQuantity, Reason)
VALUES 
  (24, '2025-04-15 10:15:00', 3, 'Damaged packaging'),
  (25, '2025-04-20 14:30:00', 1, 'Broken seal'),
  (26, '2025-04-23 09:00:00', 5, 'Expired items'),
  (27, '2025-05-01 16:45:00', 2, 'Wrong labeling'),
  (28, '2025-05-02 08:20:00', 4, 'Expired items');

select * from StockTransaction;
-- Note on remaining tables:
-- The following tables are populated through transactions or are transactional in nature:
-- 1. Stock - populated by the above StockTransaction entries via triggers