import { mysqlTable, mysqlSchema, AnyMySqlColumn, primaryKey, int, timestamp, mysqlEnum, varchar, index, foreignKey, check, text, unique } from "drizzle-orm/mysql-core"
import { sql } from "drizzle-orm"

export const customerOrder = mysqlTable("CustomerOrder", {
	customerOrderId: int("CustomerOrderID").autoincrement().notNull(),
	orderTime: timestamp("OrderTime", { mode: 'string' }).defaultNow(),
	status: mysqlEnum("Status", ['Pending','Pick and Pack','Shipped']).default('Pending').notNull(),
	address: varchar("Address", { length: 100 }),
},
(table) => [
	primaryKey({ columns: [table.customerOrderId], name: "CustomerOrder_CustomerOrderID"}),
]);

export const customerOrderDetail = mysqlTable("CustomerOrderDetail", {
	orderDetailId: int("OrderDetailID").autoincrement().notNull(),
	customerOrderId: int("CustomerOrderID").notNull().references(() => customerOrder.customerOrderId, { onDelete: "cascade" } ),
	productId: int("ProductID").notNull().references(() => product.productId, { onDelete: "cascade" } ),
	quantity: int("Quantity").notNull(),
},
(table) => [
	index("CustomerOrderID").on(table.customerOrderId),
	index("ProductID").on(table.productId),
	primaryKey({ columns: [table.orderDetailId], name: "CustomerOrderDetail_OrderDetailID"}),
	check("CustomerOrderDetail_chk_1", sql`(\`Quantity\` > 0)`),
]);

export const inboundShipment = mysqlTable("InboundShipment", {
	shipmentId: int("ShipmentID").autoincrement().notNull(),
	shipmentTime: timestamp("ShipmentTime", { mode: 'string' }).defaultNow(),
},
(table) => [
	primaryKey({ columns: [table.shipmentId], name: "InboundShipment_ShipmentID"}),
]);

export const inboundShipmentDetail = mysqlTable("InboundShipmentDetail", {
	detailId: int("DetailID").autoincrement().notNull(),
	shipmentId: int("ShipmentID").notNull().references(() => inboundShipment.shipmentId, { onDelete: "cascade" } ),
	productId: int("ProductID").notNull().references(() => product.productId, { onDelete: "cascade" } ),
	receivedQuantity: int("ReceivedQuantity"),
},
(table) => [
	index("ProductID").on(table.productId),
	index("ShipmentID").on(table.shipmentId),
	primaryKey({ columns: [table.detailId], name: "InboundShipmentDetail_DetailID"}),
	check("InboundShipmentDetail_chk_1", sql`(\`ReceivedQuantity\` >= 0)`),
]);

export const inspection = mysqlTable("Inspection", {
	inspectId: int("InspectID").autoincrement().notNull(),
	stockId: int("StockID").notNull().references(() => stock.stockId, { onDelete: "cascade" } ),
	inspectTime: timestamp("InspectTime", { mode: 'string' }).defaultNow(),
	defectQuantity: int("DefectQuantity"),
	reason: text("Reason"),
},
(table) => [
	index("StockID").on(table.stockId),
	primaryKey({ columns: [table.inspectId], name: "Inspection_InspectID"}),
	check("Inspection_chk_1", sql`(\`DefectQuantity\` >= 0)`),
]);

export const locationBin = mysqlTable("LocationBin", {
	locId: int("LocID").autoincrement().notNull(),
	aisle: varchar("Aisle", { length: 50 }),
	section: varchar("Section", { length: 50 }),
	shelf: varchar("Shelf", { length: 50 }),
	capacity: int("Capacity").notNull(),
},
(table) => [
	primaryKey({ columns: [table.locId], name: "LocationBin_LocID"}),
	check("LocationBin_chk_1", sql`(\`Capacity\` > 0)`),
]);

export const orderTransaction = mysqlTable("OrderTransaction", {
	transactionId: int("TransactionID").autoincrement().notNull(),
	customerOrderId: int("CustomerOrderID").notNull().references(() => customerOrder.customerOrderId, { onDelete: "cascade" } ),
	refId: int("RefID"),
	transactionTime: timestamp("TransactionTime", { mode: 'string' }).defaultNow(),
	transactionType: mysqlEnum("TransactionType", ['Receive','Pick and Pack','Ship']).notNull(),
},
(table) => [
	index("CustomerOrderID").on(table.customerOrderId),
	primaryKey({ columns: [table.transactionId], name: "OrderTransaction_TransactionID"}),
]);

export const outboundShipment = mysqlTable("OutboundShipment", {
	shipmentId: int("ShipmentID").autoincrement().notNull(),
	shipmentTime: timestamp("ShipmentTime", { mode: 'string' }).defaultNow(),
	carrier: varchar("Carrier", { length: 100 }),
	trackingNumber: varchar("TrackingNumber", { length: 100 }),
},
(table) => [
	primaryKey({ columns: [table.shipmentId], name: "OutboundShipment_ShipmentID"}),
	unique("TrackingNumber").on(table.trackingNumber),
]);

export const pickingList = mysqlTable("PickingList", {
	picklistId: int("PicklistID").autoincrement().notNull(),
	generatedAt: timestamp("GeneratedAt", { mode: 'string' }).defaultNow(),
	doneAt: timestamp("DoneAt", { mode: 'string' }),
},
(table) => [
	primaryKey({ columns: [table.picklistId], name: "PickingList_PicklistID"}),
]);

export const product = mysqlTable("Product", {
	productId: int("ProductID").autoincrement().notNull(),
	name: varchar("Name", { length: 255 }).notNull(),
	sku: varchar("SKU", { length: 100 }).notNull(),
	unitOfMeasure: varchar("UnitOfMeasure", { length: 50 }),
	createdAt: timestamp("CreatedAt", { mode: 'string' }).defaultNow(),
	updatedAt: timestamp("UpdatedAt", { mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	primaryKey({ columns: [table.productId], name: "Product_ProductID"}),
	unique("SKU").on(table.sku),
]);

export const purchaseOrder = mysqlTable("PurchaseOrder", {
	poId: int("PO_ID").autoincrement().notNull(),
	shipmentId: int("ShipmentID").notNull().references(() => inboundShipment.shipmentId, { onDelete: "cascade" } ),
	createdAt: timestamp("CreatedAt", { mode: 'string' }).defaultNow(),
},
(table) => [
	index("ShipmentID").on(table.shipmentId),
	primaryKey({ columns: [table.poId], name: "PurchaseOrder_PO_ID"}),
]);

export const purchaseOrderDetail = mysqlTable("PurchaseOrderDetail", {
	poDetailId: int("PODetailID").autoincrement().notNull(),
	poId: int("PO_ID").notNull().references(() => purchaseOrder.poId, { onDelete: "cascade" } ),
	productId: int("ProductID").notNull().references(() => product.productId, { onDelete: "cascade" } ),
	orderedQuantity: int("OrderedQuantity"),
},
(table) => [
	index("PO_ID").on(table.poId),
	index("ProductID").on(table.productId),
	primaryKey({ columns: [table.poDetailId], name: "PurchaseOrderDetail_PODetailID"}),
	check("PurchaseOrderDetail_chk_1", sql`(\`OrderedQuantity\` > 0)`),
]);

export const stock = mysqlTable("Stock", {
	stockId: int("StockID").autoincrement().notNull(),
	productId: int("ProductID").notNull().references(() => product.productId, { onDelete: "cascade" } ),
	locId: int("LocID").notNull().references(() => locationBin.locId, { onDelete: "cascade" } ),
	quantity: int("Quantity").notNull(),
	lastUpdated: timestamp("LastUpdated", { mode: 'string' }).defaultNow().onUpdateNow(),
},
(table) => [
	index("LocID").on(table.locId),
	index("ProductID").on(table.productId),
	primaryKey({ columns: [table.stockId], name: "Stock_StockID"}),
	check("Stock_chk_1", sql`(\`Quantity\` >= 0)`),
]);

export const stockTransaction = mysqlTable("StockTransaction", {
	transactionId: int("TransactionID").autoincrement().notNull(),
	productId: int("ProductID").notNull().references(() => product.productId, { onDelete: "cascade" } ),
	locId: int("LocID").notNull().references(() => locationBin.locId, { onDelete: "cascade" } ),
	transactionType: mysqlEnum("TransactionType", ['Store','Pick','Remove']).notNull(),
	refId: int("RefID"),
	quantity: int("Quantity").notNull(),
	transactionTime: timestamp("TransactionTime", { mode: 'string' }).defaultNow(),
},
(table) => [
	index("LocID").on(table.locId),
	index("ProductID").on(table.productId),
	primaryKey({ columns: [table.transactionId], name: "StockTransaction_TransactionID"}),
	check("StockTransaction_chk_1", sql`(\`Quantity\` > 0)`),
]);

export const user = mysqlTable("User", {
	userId: int("UserID").autoincrement().notNull(),
	username: varchar("Username", { length: 50 }).notNull(),
	password: varchar("Password", { length: 255 }).notNull(),
	role: mysqlEnum("Role", ['Admin','User','Manager']).default('User').notNull(),
	email: varchar("Email", { length: 100 }),
	createdAt: timestamp("CreatedAt", { mode: 'string' }).defaultNow(),
	lastLogin: timestamp("LastLogin", { mode: 'string' }),
},
(table) => [
	primaryKey({ columns: [table.userId], name: "User_UserID"}),
	unique("Email").on(table.email),
	unique("Username").on(table.username),
]);
