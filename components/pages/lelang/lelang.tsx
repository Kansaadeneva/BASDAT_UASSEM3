"use client";
import { useRouter } from "next/router";

export default function LelangInfo() {
  const router = useRouter();
  const { name } = router.query;

  const dummyAuction = {
    name: name || "Nama Lelang Tidak Diketahui",
    startingBid: 100000,
    currentBid: 120000,
    endDate: "2024-12-01",
  };

  return (
    <div className="p-8 max-w-lg mx-auto">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-6 rounded-t-lg shadow-lg">
        <h1 className="text-3xl font-extrabold text-center">
          Informasi Lelang
        </h1>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 shadow-lg rounded-b-lg border-t-4 border-blue-600">
        <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4 text-center">
          {dummyAuction.name}
        </h2>
        <div className="space-y-2 text-gray-700 dark:text-gray-300">
          <p>
            <span className="font-medium">Bid Awal:</span>{" "}
            <span className="text-blue-500 font-bold">
              Rp. {dummyAuction.startingBid.toLocaleString()}
            </span>
          </p>
          <p>
            <span className="font-medium">Bid Terkini:</span>{" "}
            <span className="text-green-500 font-bold">
              Rp. {dummyAuction.currentBid.toLocaleString()}
            </span>
          </p>
          <p>
            <span className="font-medium">Batas Waktu:</span>{" "}
            <span className="text-red-500 font-bold">
              {dummyAuction.endDate}
            </span>
          </p>
        </div>
        <button
          className="mt-6 w-full px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-medium rounded-lg shadow-md transform transition-transform hover:scale-105 hover:shadow-lg"
          onClick={() => alert("Lelang berhasil diikuti!")}
        >
          Ikuti Lelang
        </button>
      </div>
    </div>
  );
}