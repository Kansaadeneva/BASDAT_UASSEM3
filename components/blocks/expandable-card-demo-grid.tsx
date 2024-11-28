"use client";
import Image from "next/image";
import React, { useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useOutsideClick } from "@/hooks/use-outside-click";
import axios from "axios";
import FloatingNav from '@/crudbasdat/components/ui/floating-navbar';


interface Product {
  description: string;
  name: string;
  price: number;
  createdAt: string;
  username: string;
}

export default function ExpandableCardDemo() {
  const [active, setActive] = useState<Product | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cart, setCart] = useState<Product[]>([]);
  const id = useId();
  const ref = useRef<HTMLDivElement>(null);

  const addToCart = (product: Product) => {
    // Tambahkan produk ke keranjang
    const updatedCart = [...cart, product]; // Asumsi cart ada di state
    setCart(updatedCart);
    alert(`Produk ${product.name} berhasil ditambahkan ke keranjang!`);
  };  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/product");
        setProducts(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActive(null);
      }
    };

    if (active) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  return (
    <>
      <floating-navbar
        className="fixed top-0 left-0 right-0 z-[1000]"
        cartItems={cart.length}
      />
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 h-full w-full z-10"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {active && (
          <div className="fixed inset-0 grid place-items-center z-[100]">
            <motion.div
              layoutId={`card-${active.name}-${id}`}
              ref={ref}
              className="w-full max-w-[500px] bg-white rounded-lg shadow-lg overflow-hidden"
            >
              {/* Gambar Produk */}
              <motion.div layoutId={`image-${active.name}-${id}`}>
                <Image
                  priority
                  width={500}
                  height={300}
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Plain-M%26Ms-Pile.jpg/375px-Plain-M%26Ms-Pile.jpg"
                  alt={active.name}
                  className="w-full h-64 object-cover"
                />
              </motion.div>

              <div className="p-4">
                {/* Informasi Produk */}
                <motion.h3
                  layoutId={`name-${active.name}-${id}`}
                  className="font-bold text-xl text-gray-800"
                >
                  {active.name}
                </motion.h3>
                <motion.p
                  layoutId={`description-${active.description}-${id}`}
                  className="text-gray-600 mt-2"
                >
                  {active.description}
                </motion.p>

                <div className="mt-4">
                  <span className="text-lg font-semibold text-gray-700">
                    Rp. {active.price.toLocaleString()}
                  </span>
                </div>

                {/* Tombol Aksi */}
                <div className="flex gap-4 mt-6">
                  <motion.a
                    layout
                    className="px-6 py-2 bg-blue-500 text-white font-bold rounded-full hover:bg-blue-600 transition"
                    href={`/lelang/${encodeURIComponent(active.name)}`} // Arahkan ke halaman detail lelang berdasarkan nama produk
                  >
                    Lelang
                  </motion.a>

                  <motion.button
                    layout
                    onClick={() => addToCart(active)} // Menambahkan ke keranjang
                    className="px-6 py-2 bg-green-500 text-white font-bold rounded-full hover:bg-green-600 transition"
                  >
                    Beli Produk
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Daftar Produk */}
      <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
        {products.map((product) => (
          <motion.div
            layoutId={`card-${product.name}-${id}`}
            key={product.name}
            onClick={() => setActive(product)}
            className="p-4 bg-white rounded-lg shadow-lg hover:shadow-xl transition cursor-pointer"
          >
            {/* Gambar Produk */}
            <motion.div layoutId={`image-${product.name}-${id}`}>
              <Image
                width={150}
                height={150}
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Plain-M%26Ms-Pile.jpg/375px-Plain-M%26Ms-Pile.jpg"
                alt={product.name}
                className="w-full h-40 rounded-md object-cover"
              />
            </motion.div>
            {/* Detail Produk */}
            <div className="mt-4">
              <motion.h3
                layoutId={`name-${product.name}-${id}`}
                className="font-medium text-gray-800"
              >
                {product.name}
              </motion.h3>
              <motion.p
                layoutId={`description-${product.description}-${id}`}
                className="text-gray-600 mt-2"
              >
                Rp. {product.price.toLocaleString()}
              </motion.p>
            </div>
          </motion.div>
        ))}
      </ul>
    </>
  );
}