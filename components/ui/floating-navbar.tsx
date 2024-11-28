"use client";
import React, { useState } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { FiShoppingCart } from "react-icons/fi";

export const FloatingNav = ({
  navItems,
  className,
  username,
  cartItems: initialCartItems,
}: {
  navItems: {
    name: string;
    link: string;
    icon?: JSX.Element
  }[];
  className?: string;
  username?: string;
  cartItems: number;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const [cartItems, setCartItems] = useState(initialCartItems);

  useMotionValueEvent(scrollYProgress, "change", (current) => {
    if (typeof current === "number") {
      let direction = current! - scrollYProgress.getPrevious()!;
      if (scrollYProgress.get() < 0.05) {
        setVisible(true);
      } else {
        if (direction < 0) {
          setVisible(false);
        } else {
          setVisible(true);
        }
      }
    }
  });

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 1, y: -100 }}
        animate={{ y: visible ? 0 : -100, opacity: visible ? 1 : 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "flex max-w-fit fixed top-5 inset-x-0 mx-auto z-[5000] items-center justify-center space-x-6 px-8 py-3 rounded-full shadow-lg backdrop-blur-md bg-gradient-to-r from-blue-500/30 to-purple-600/30 border border-white/20",
          className
        )}
      >
        {navItems.map((navItem: any, idx: number) => (
          <Link
            key={`link=${idx}`}
            href={navItem.link}
            className="relative group flex items-center space-x-2 text-white hover:text-purple-200 transition-all"
          >
            <span className="text-lg">{navItem.icon}</span>
            <span className="hidden sm:block text-sm font-semibold">
              {navItem.name}
            </span>
            <motion.div
              className="absolute bottom-0 left-0 h-[2px] w-full bg-purple-500 scale-x-0 group-hover:scale-x-100 origin-left transition-transform"
            ></motion.div>
          </Link>
        ))}

        <Link href={"/cart"}>
          <div className="relative flex items-center cursor-pointer">
            <motion.div
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              className="text-xl text-white"
            >
              <FiShoppingCart />
            </motion.div>
            {cartItems >= 0 && (
              <span className="absolute -top-1 -right-2 w-5 h-5 bg-red-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-md">
                {cartItems}
              </span>
            )}
          </div>
        </Link>

        {!username ? (
          <Link href={"/signin"}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="border text-sm font-semibold px-6 py-2 rounded-full text-white bg-gradient-to-r from-purple-500 to-blue-500 hover:from-blue-500 hover:to-purple-500 transition-all"
            >
              Sign In
            </motion.button>
          </Link>
        ) : (
          <Link href={"/profile"}>
            <motion.button
              whileHover={{ scale: 1.1 }}
              className="border text-sm font-semibold px-6 py-2 rounded-full text-white bg-gradient-to-r from-green-500 to-teal-500 hover:from-teal-500 hover:to-green-500 transition-all"
            >
              {username}
            </motion.button>
          </Link>
        )}
      </motion.div>
    </AnimatePresence>
  );
};