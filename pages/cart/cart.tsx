"use client";
import { useState } from "react";

export default function CartPage() {
  const [cart, setCart] = useState<Product[]>([]); // Data keranjang dari state utama

  const removeFromCart = (product: Product) => {
    const updatedCart = cart.filter((item) => item.name !== product.name);
    setCart(updatedCart);
    alert(`Produk ${product.name} dihapus dari keranjang!`);
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Keranjang Belanja</h1>
      <ul className="space-y-4">
        {cart.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between bg-white p-4 shadow rounded-lg"
          >
            <div>
              <h2 className="font-semibold">{item.name}</h2>
              <p>Rp. {item.price.toLocaleString()}</p>
            </div>
            <button
              className="px-4 py-2 bg-red-500 text-white rounded-lg"
              onClick={() => removeFromCart(item)}
            >
              Hapus
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}