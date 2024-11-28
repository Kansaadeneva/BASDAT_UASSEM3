"use client";
import { useRouter } from "next/router";

export default function LelangInfo() {
  const router = useRouter();
  const { name } = router.query;

  if (!name) {
    return <p>Memuat informasi lelang...</p>;
  }

  // Data dummy lelang, bisa diganti dengan fetch API
  const dummyAuction = {
    name: name,
    startingBid: 100000,
    currentBid: 120000,
    endDate: "2024-12-01",
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Informasi Lelang</h1>
      <div className="bg-white p-4 shadow rounded-lg">
        <h2 className="text-xl font-semibold">{dummyAuction.name}</h2>
        <p>Bid Awal: Rp. {dummyAuction.startingBid.toLocaleString()}</p>
        <p>Bid Terkini: Rp. {dummyAuction.currentBid.toLocaleString()}</p>
        <p>Batas Waktu: {dummyAuction.endDate}</p>
        <button
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg"
          onClick={() => alert("Lelang berhasil diikuti!")}
        >
          Ikuti Lelang
        </button>
      </div>
    </div>
  );
}