CREATE TABLE IF NOT EXISTS Product (
    ProductID INT PRIMARY KEY,
    Name VARCHAR(255) NOT NULL,
    SKU VARCHAR(100) UNIQUE NOT NULL,
    UnitOfMeasure VARCHAR(50),
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UpdatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS CustomerOrder ( -- Customize for Warehouse usage
    -- Add Shipment ID
    CustomerOrderID INT PRIMARY KEY,
    OrderDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Address VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS CustomerOrderDetail ( -- Only care about quantity (no price included)
    OrderDetailID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerOrderID INT NOT NULL,
    ProductID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity > 0),
    FOREIGN KEY (CustomerOrderID) REFERENCES CustomerOrder(CustomerOrderID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS LocationBin (
    LocID INT PRIMARY KEY,
    Aisle VARCHAR(50),
    Section VARCHAR(50),
    Shelf VARCHAR(50),
    Capacity INT NOT NULL CHECK (Capacity > 0)
    -- THE FIXED CAPACITY - DO NOT CHANGE
);

CREATE TABLE IF NOT EXISTS Stock (
    StockID INT PRIMARY KEY AUTO_INCREMENT,
    ProductID INT NOT NULL,
    LocID INT NOT NULL,
    Quantity INT NOT NULL CHECK (Quantity >= 0), -- get updated by trigger in Stock Transaction
    -- QUANTITY IS AUTOMATICALLY CALCULATED
    LastUpdated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE,
    FOREIGN KEY (LocID) REFERENCES LocationBin(LocID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS StockTransaction (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    StockID INT NOT NULL,
    TransactionType ENUM('Store', 'Pick', 'Remove') NOT NULL,
    RefID INT, -- Can be PickListID or InspectID? CHECK WITH TRIGGER? -- trigger: Store + , Others -
    Quantity INT NOT NULL CHECK (Quantity > 0),
    TransactionDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (StockID) REFERENCES Stock(StockID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS Inspection (
    InspectID INT PRIMARY KEY AUTO_INCREMENT,
    StockID INT NOT NULL,
    InspectDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    DefectQuantity INT CHECK (DefectQuantity >= 0),
    Reason TEXT,
    FOREIGN KEY (StockID) REFERENCES Stock(StockID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS OutboundShipment (
    ShipmentID INT PRIMARY KEY AUTO_INCREMENT,
    ShipmentDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Carrier VARCHAR(100),
    TrackingNumber VARCHAR(100) UNIQUE
);

CREATE TABLE IF NOT EXISTS PickingList (
    PicklistID INT PRIMARY KEY AUTO_INCREMENT,
    GeneratedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP, -- the moment the list is generated
    DoneAt TIMESTAMP -- specify when all the items are collected
);

CREATE TABLE IF NOT EXISTS OrderTransaction (
    TransactionID INT PRIMARY KEY AUTO_INCREMENT,
    CustomerOrderID INT NOT NULL,
    RefID INT, -- Can be ShipmentID or PickListID ?? Enforced by triggerr?
    TransactionTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    TransactionType ENUM('Receive', 'Pick and Pack', 'Ship') NOT NULL,
    FOREIGN KEY (CustomerOrderID) REFERENCES CustomerOrder(CustomerOrderID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS InboundShipment (
    ShipID INT PRIMARY KEY AUTO_INCREMENT,
    ShipmentTime TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS InboundShipmentDetail (
    DetailID INT PRIMARY KEY AUTO_INCREMENT,
    ShipID INT NOT NULL,
    ProductID INT NOT NULL,
    ReceivedQuantity INT CHECK (ReceivedQuantity >= 0),
    FOREIGN KEY (ShipID) REFERENCES InboundShipment(ShipID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);

/* CREATE TABLE IF NOT EXISTS ASN (
    ASNID INT PRIMARY KEY AUTO_INCREMENT,
    FilePath VARCHAR(255) NOT NULL,
    SentAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ExpectedDelivery DATE NOT NULL,
    ShipID INT NOT NULL,
    FOREIGN KEY (ShipID) REFERENCES InboundShipment(ShipID) ON DELETE CASCADE
);
   */ -- Can be used to alert expected delivery time - but complex relationship

CREATE TABLE IF NOT EXISTS PurchaseOrder (
    PO_ID INT PRIMARY KEY AUTO_INCREMENT,
    ShipID INT NOT NULL,
    CreatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (ShipID) REFERENCES InboundShipment(ShipID) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS PurchaseOrderDetail (
    PODetailID INT PRIMARY KEY AUTO_INCREMENT,
    PO_ID INT NOT NULL,
    ProductID INT NOT NULL,
    OrderedQuantity INT CHECK (OrderedQuantity > 0),
    FOREIGN KEY (PO_ID) REFERENCES PurchaseOrder(PO_ID) ON DELETE CASCADE,
    FOREIGN KEY (ProductID) REFERENCES Product(ProductID) ON DELETE CASCADE
);
-- should also check the avaiilabolity of the stock
DELIMITER ||
CREATE TRIGGER AutomateStockQuantity BEFORE INSERT ON StockTransaction
    FOR EACH ROW
    BEGIN
        -- DECLARE AND ASSIGN VARIABLES
        DECLARE Loc, Product INT;
        DECLARE AvailableSpace, CurrentStock INT;
        SELECT LocID, ProductID INTO Loc, Product
            FROM Stock WHERE Stock.StockID = NEW.StockID;
        IF NEW.TransactionType = "Store"
        THEN
            -- GET FREE SPACE FROM LOCBIN

            SELECT (LocationBin.Capacity - StockAggregation.Sum)
            INTO AvailableSpace
            FROM LocationBin,
                 (SELECT LocID, SUM(Quantity) AS Sum
                  FROM Stock
                  GROUP BY LocID) StockAggregation
            WHERE
                LocationBin.LocID = StockAggregation.LocID
              AND
                LocationBin.LocID = Loc;

            -- UPDATE THE STOCK OR SIGNAL ERROR
            IF AvailableSpace >= NEW.Quantity
            THEN
                UPDATE Stock
                SET Quantity = Quantity + NEW.Quantity
                WHERE StockID = NEW.StockID;
            ELSE
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'There is no available space in this location';

            END IF;
        ELSE
            SELECT Quantity
            INTO CurrentStock
            FROM Stock
            WHERE Stock.StockID = NEW.StockID;

            IF CurrentStock >= NEW.Quantity
            THEN
                UPDATE Stock
                SET Quantity = Quantity - new.Quantity
                WHERE Stock.StockID = NEW.StockID;
            ELSE
                SIGNAL SQLSTATE '45000'
                SET MESSAGE_TEXT = 'The stock is not enough for this transaction';
                END IF;
        END IF;
    END ||

CREATE PROCEDURE AlertInboundDiscrepancies ()
BEGIN
    SELECT PurchaseOrder.PO_ID, PurchaseOrderDetail.ProductID, OrderedQuantity, ReceivedQuantity, (OrderedQuantity - ReceivedQuantity) AS Discrepancy
    FROM PurchaseOrderDetail
    JOIN PurchaseOrder
        ON PurchaseOrderDetail.PO_ID = PurchaseOrder.PO_ID
    JOIN ASN
        ON PurchaseOrder.ASNID = ASN.ASNID
    JOIN InboundShipment
        ON ASN.ShipID = InboundShipment.ShipID
    JOIN InboundShipmentDetail
        ON InboundShipment.ShipID = InboundShipmentDetail.ShipID
        AND InboundShipmentDetail.ProductID = PurchaseOrderDetail.ProductID;

END ||