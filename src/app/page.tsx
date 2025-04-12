import db from "@/database";
import { locationBin } from "@/../drizzle/schema";
export default async function Home() {
  // Example query
  await db.insert(locationBin).values([
    {
      locId: 1,
      aisle: "A1",
      section: "S1",
      shelf: "SH1",
      capacity: 100,
    },
    {
      locId: 2,
      aisle: "A2",
      section: "S1",
      shelf: "SH2",
      capacity: 150,
    },
    {
      locId: 3,
      aisle: "A1",
      section: "S2",
      shelf: "SH1",
      capacity: 120,
    },
  ]);
  const locationBins = await db.select().from(locationBin);
  console.log(locationBins);
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>
        {" "}
        {locationBins.map((bin) => (
          <div key={bin.locId}>
            <p>LocID: {bin.locId}</p>
            <p>Aisle: {bin.aisle}</p>
            <p>Section: {bin.section}</p>
            <p>Shelf: {bin.shelf}</p>
            <p>Capacity: {bin.capacity}</p>
          </div>
        ))}
      </h1>
    </div>
  );
}
