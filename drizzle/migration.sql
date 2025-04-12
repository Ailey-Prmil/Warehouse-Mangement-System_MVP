-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TABLE `CustomerOrder` (
	`CustomerOrderID` int NOT NULL,
	`OrderDate` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`Status` enum('Pending','Pick and Pack','Shipped') NOT NULL DEFAULT 'Pending',
	`Address` varchar(100),
	CONSTRAINT `CustomerOrder_CustomerOrderID` PRIMARY KEY(`CustomerOrderID`)
);
--> statement-breakpoint
CREATE TABLE `CustomerOrderDetail` (
	`OrderDetailID` int AUTO_INCREMENT NOT NULL,
	`CustomerOrderID` int NOT NULL,
	`ProductID` int NOT NULL,
	`Quantity` int NOT NULL,
	CONSTRAINT `CustomerOrderDetail_OrderDetailID` PRIMARY KEY(`OrderDetailID`),
	CONSTRAINT `CustomerOrderDetail_chk_1` CHECK((`Quantity` > 0))
);
--> statement-breakpoint
CREATE TABLE `InboundShipment` (
	`ShipID` int AUTO_INCREMENT NOT NULL,
	`ShipmentTime` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `InboundShipment_ShipID` PRIMARY KEY(`ShipID`)
);
--> statement-breakpoint
CREATE TABLE `InboundShipmentDetail` (
	`DetailID` int AUTO_INCREMENT NOT NULL,
	`ShipID` int NOT NULL,
	`ProductID` int NOT NULL,
	`ReceivedQuantity` int,
	CONSTRAINT `InboundShipmentDetail_DetailID` PRIMARY KEY(`DetailID`),
	CONSTRAINT `InboundShipmentDetail_chk_1` CHECK((`ReceivedQuantity` >= 0))
);
--> statement-breakpoint
CREATE TABLE `Inspection` (
	`InspectID` int AUTO_INCREMENT NOT NULL,
	`StockID` int NOT NULL,
	`InspectDate` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`DefectQuantity` int,
	`Reason` text,
	CONSTRAINT `Inspection_InspectID` PRIMARY KEY(`InspectID`),
	CONSTRAINT `Inspection_chk_1` CHECK((`DefectQuantity` >= 0))
);
--> statement-breakpoint
CREATE TABLE `LocationBin` (
	`LocID` int NOT NULL,
	`Aisle` varchar(50),
	`Section` varchar(50),
	`Shelf` varchar(50),
	`Capacity` int NOT NULL,
	CONSTRAINT `LocationBin_LocID` PRIMARY KEY(`LocID`),
	CONSTRAINT `LocationBin_chk_1` CHECK((`Capacity` > 0))
);
--> statement-breakpoint
CREATE TABLE `OrderTransaction` (
	`TransactionID` int AUTO_INCREMENT NOT NULL,
	`CustomerOrderID` int NOT NULL,
	`RefID` int,
	`TransactionTime` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`TransactionType` enum('Receive','Pick and Pack','Ship') NOT NULL,
	CONSTRAINT `OrderTransaction_TransactionID` PRIMARY KEY(`TransactionID`)
);
--> statement-breakpoint
CREATE TABLE `OutboundShipment` (
	`ShipmentID` int AUTO_INCREMENT NOT NULL,
	`ShipmentDate` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`Carrier` varchar(100),
	`TrackingNumber` varchar(100),
	CONSTRAINT `OutboundShipment_ShipmentID` PRIMARY KEY(`ShipmentID`),
	CONSTRAINT `TrackingNumber` UNIQUE(`TrackingNumber`)
);
--> statement-breakpoint
CREATE TABLE `PickingList` (
	`PicklistID` int AUTO_INCREMENT NOT NULL,
	`GeneratedAt` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`DoneAt` timestamp,
	CONSTRAINT `PickingList_PicklistID` PRIMARY KEY(`PicklistID`)
);
--> statement-breakpoint
CREATE TABLE `Product` (
	`ProductID` int NOT NULL,
	`Name` varchar(255) NOT NULL,
	`SKU` varchar(100) NOT NULL,
	`UnitOfMeasure` varchar(50),
	`CreatedAt` timestamp DEFAULT (CURRENT_TIMESTAMP),
	`UpdatedAt` timestamp DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Product_ProductID` PRIMARY KEY(`ProductID`),
	CONSTRAINT `SKU` UNIQUE(`SKU`)
);
--> statement-breakpoint
CREATE TABLE `PurchaseOrder` (
	`PO_ID` int AUTO_INCREMENT NOT NULL,
	`ShipID` int NOT NULL,
	`CreatedAt` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `PurchaseOrder_PO_ID` PRIMARY KEY(`PO_ID`)
);
--> statement-breakpoint
CREATE TABLE `PurchaseOrderDetail` (
	`PODetailID` int AUTO_INCREMENT NOT NULL,
	`PO_ID` int NOT NULL,
	`ProductID` int NOT NULL,
	`OrderedQuantity` int,
	CONSTRAINT `PurchaseOrderDetail_PODetailID` PRIMARY KEY(`PODetailID`),
	CONSTRAINT `PurchaseOrderDetail_chk_1` CHECK((`OrderedQuantity` > 0))
);
--> statement-breakpoint
CREATE TABLE `Stock` (
	`StockID` int AUTO_INCREMENT NOT NULL,
	`ProductID` int NOT NULL,
	`LocID` int NOT NULL,
	`Quantity` int NOT NULL,
	`LastUpdated` timestamp DEFAULT (CURRENT_TIMESTAMP) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `Stock_StockID` PRIMARY KEY(`StockID`),
	CONSTRAINT `Stock_chk_1` CHECK((`Quantity` >= 0))
);
--> statement-breakpoint
CREATE TABLE `StockTransaction` (
	`TransactionID` int AUTO_INCREMENT NOT NULL,
	`ProductID` int NOT NULL,
	`LocID` int NOT NULL,
	`TransactionType` enum('Store','Pick','Remove') NOT NULL,
	`RefID` int,
	`Quantity` int NOT NULL,
	`TransactionDate` timestamp DEFAULT (CURRENT_TIMESTAMP),
	CONSTRAINT `StockTransaction_TransactionID` PRIMARY KEY(`TransactionID`),
	CONSTRAINT `StockTransaction_chk_1` CHECK((`Quantity` > 0))
);
--> statement-breakpoint
ALTER TABLE `CustomerOrderDetail` ADD CONSTRAINT `CustomerOrderDetail_ibfk_1` FOREIGN KEY (`CustomerOrderID`) REFERENCES `CustomerOrder`(`CustomerOrderID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `CustomerOrderDetail` ADD CONSTRAINT `CustomerOrderDetail_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `InboundShipmentDetail` ADD CONSTRAINT `InboundShipmentDetail_ibfk_1` FOREIGN KEY (`ShipID`) REFERENCES `InboundShipment`(`ShipID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `InboundShipmentDetail` ADD CONSTRAINT `InboundShipmentDetail_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Inspection` ADD CONSTRAINT `Inspection_ibfk_1` FOREIGN KEY (`StockID`) REFERENCES `Stock`(`StockID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `OrderTransaction` ADD CONSTRAINT `OrderTransaction_ibfk_1` FOREIGN KEY (`CustomerOrderID`) REFERENCES `CustomerOrder`(`CustomerOrderID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `PurchaseOrder` ADD CONSTRAINT `PurchaseOrder_ibfk_1` FOREIGN KEY (`ShipID`) REFERENCES `InboundShipment`(`ShipID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `PurchaseOrderDetail` ADD CONSTRAINT `PurchaseOrderDetail_ibfk_1` FOREIGN KEY (`PO_ID`) REFERENCES `PurchaseOrder`(`PO_ID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `PurchaseOrderDetail` ADD CONSTRAINT `PurchaseOrderDetail_ibfk_2` FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `Stock` ADD CONSTRAINT `Stock_ibfk_2` FOREIGN KEY (`LocID`) REFERENCES `LocationBin`(`LocID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `StockTransaction` ADD CONSTRAINT `StockTransaction_ibfk_1` FOREIGN KEY (`ProductID`) REFERENCES `Product`(`ProductID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE `StockTransaction` ADD CONSTRAINT `StockTransaction_ibfk_2` FOREIGN KEY (`LocID`) REFERENCES `LocationBin`(`LocID`) ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX `CustomerOrderID` ON `CustomerOrderDetail` (`CustomerOrderID`);--> statement-breakpoint
CREATE INDEX `ProductID` ON `CustomerOrderDetail` (`ProductID`);--> statement-breakpoint
CREATE INDEX `ProductID` ON `InboundShipmentDetail` (`ProductID`);--> statement-breakpoint
CREATE INDEX `ShipID` ON `InboundShipmentDetail` (`ShipID`);--> statement-breakpoint
CREATE INDEX `StockID` ON `Inspection` (`StockID`);--> statement-breakpoint
CREATE INDEX `CustomerOrderID` ON `OrderTransaction` (`CustomerOrderID`);--> statement-breakpoint
CREATE INDEX `ShipID` ON `PurchaseOrder` (`ShipID`);--> statement-breakpoint
CREATE INDEX `PO_ID` ON `PurchaseOrderDetail` (`PO_ID`);--> statement-breakpoint
CREATE INDEX `ProductID` ON `PurchaseOrderDetail` (`ProductID`);--> statement-breakpoint
CREATE INDEX `LocID` ON `Stock` (`LocID`);--> statement-breakpoint
CREATE INDEX `ProductID` ON `Stock` (`ProductID`);--> statement-breakpoint
CREATE INDEX `LocID` ON `StockTransaction` (`LocID`);--> statement-breakpoint
CREATE INDEX `ProductID` ON `StockTransaction` (`ProductID`);
*/