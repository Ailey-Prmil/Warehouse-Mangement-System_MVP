// "use client";

// import { useEffect, useState } from "react";

// export default function HomeClient() {
//   const [locationBins, setLocationBins] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchLocationBins = async () => {
//       const res = await fetch("/api/location"); // No need for full URL in client
//       const data = await res.json();
//       setLocationBins(data);
//       setLoading(false);
//     };

//     fetchLocationBins();
//   }, []); // empty dependency array = run once on mount

//   if (loading) return <div>Loading...</div>;

//   return (
//     <div className="p-8">
//       <h1 className="text-3xl font-bold mb-4">Location Bins</h1>
//       {locationBins.map((bin) => (
//         <div key={bin.locId} className="mb-2">
//           LocID: {bin.locId}
//         </div>
//       ))}
//     </div>
//   );
// }

export default async function Home() {
  const res = await fetch("http://localhost:3001/api/location", {
    cache: "no-store", // disables caching (good for dynamic data)
  });
  const locationBins = await res.json();
  console.log(locationBins);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <h1>
        <div className="text-3xl font-bold">Welcome to the Warehouse</div>
        {locationBins.map((bin: any) => (
          <div key={bin.locId} className="flex gap-2 flex-col">
            <p>LocID {bin.locId}</p>
            <h1>Capacity: {bin.capacity}</h1>
          </div>
        ))}
      </h1>
    </div>
  );
}
