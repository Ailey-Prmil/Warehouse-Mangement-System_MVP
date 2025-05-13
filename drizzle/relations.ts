import { relations } from "drizzle-orm/relations";
import { customerOrder, customerOrderDetail, product, inboundShipment, inboundShipmentDetail, stock, inspection, orderTransaction, purchaseOrder, purchaseOrderDetail, locationBin, stockTransaction } from "./schema";

export const customerOrderDetailRelations = relations(customerOrderDetail, ({one}) => ({
	customerOrder: one(customerOrder, {
		fields: [customerOrderDetail.customerOrderId],
		references: [customerOrder.customerOrderId]
	}),
	product: one(product, {
		fields: [customerOrderDetail.productId],
		references: [product.productId]
	}),
}));

export const customerOrderRelations = relations(customerOrder, ({many}) => ({
	customerOrderDetails: many(customerOrderDetail),
	orderTransactions: many(orderTransaction),
}));

export const productRelations = relations(product, ({many}) => ({
	customerOrderDetails: many(customerOrderDetail),
	inboundShipmentDetails: many(inboundShipmentDetail),
	purchaseOrderDetails: many(purchaseOrderDetail),
	stocks: many(stock),
	stockTransactions: many(stockTransaction),
}));

export const inboundShipmentDetailRelations = relations(inboundShipmentDetail, ({one}) => ({
	inboundShipment: one(inboundShipment, {
		fields: [inboundShipmentDetail.shipmentId],
		references: [inboundShipment.shipmentId]
	}),
	product: one(product, {
		fields: [inboundShipmentDetail.productId],
		references: [product.productId]
	}),
}));

export const inboundShipmentRelations = relations(inboundShipment, ({many}) => ({
	inboundShipmentDetails: many(inboundShipmentDetail),
	purchaseOrders: many(purchaseOrder),
}));

export const inspectionRelations = relations(inspection, ({one}) => ({
	stock: one(stock, {
		fields: [inspection.stockId],
		references: [stock.stockId]
	}),
}));

export const stockRelations = relations(stock, ({one, many}) => ({
	inspections: many(inspection),
	product: one(product, {
		fields: [stock.productId],
		references: [product.productId]
	}),
	locationBin: one(locationBin, {
		fields: [stock.locId],
		references: [locationBin.locId]
	}),
}));

export const orderTransactionRelations = relations(orderTransaction, ({one}) => ({
	customerOrder: one(customerOrder, {
		fields: [orderTransaction.customerOrderId],
		references: [customerOrder.customerOrderId]
	}),
}));

export const purchaseOrderRelations = relations(purchaseOrder, ({one, many}) => ({
	inboundShipment: one(inboundShipment, {
		fields: [purchaseOrder.shipmentId],
		references: [inboundShipment.shipmentId]
	}),
	purchaseOrderDetails: many(purchaseOrderDetail),
}));

export const purchaseOrderDetailRelations = relations(purchaseOrderDetail, ({one}) => ({
	purchaseOrder: one(purchaseOrder, {
		fields: [purchaseOrderDetail.poId],
		references: [purchaseOrder.poId]
	}),
	product: one(product, {
		fields: [purchaseOrderDetail.productId],
		references: [product.productId]
	}),
}));

export const locationBinRelations = relations(locationBin, ({many}) => ({
	stocks: many(stock),
	stockTransactions: many(stockTransaction),
}));

export const stockTransactionRelations = relations(stockTransaction, ({one}) => ({
	product: one(product, {
		fields: [stockTransaction.productId],
		references: [product.productId]
	}),
	locationBin: one(locationBin, {
		fields: [stockTransaction.locId],
		references: [locationBin.locId]
	}),
}));