import db from "@/database";
import { eq } from "drizzle-orm";
import { locationBin, customerOrder } from "@/../drizzle/schema";
export default async function Home() {
  const locationBins = await db.select().from(locationBin);
  const customerOrders = await db
    .select()
    .from(customerOrder)
    .where(eq(customerOrder.status, "Pending"))
    .limit(5);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>
        {" "}
        {locationBins.map((bin) => (
          <div key={bin.locId} className="flex gap-2 flex-col">
            <h1>LocID: {bin.locId}</h1>
          </div>
        ))}
        {customerOrders.map((order) => (
          <div key={order.customerOrderId} className="flex gap-2 flex-col">
            <h1>CustomerOrderID: {order.customerOrderId}</h1>
          </div>
        ))}
      </h1>
    </div>
  );
}
