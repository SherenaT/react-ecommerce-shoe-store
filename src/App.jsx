import React, { useState, useEffect } from "react";
import "./App.css";
import Footer from "./Footer";
import Header from "./Header";
import Products from "./Products";
import { Routes, Route } from "react-router-dom";
import Detail from "./Detail";
import Cart from "./Cart";
import Checkout from "./Checkout";

export default function App() {
  const [cart, setCart] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("cart")) ?? [];
    } catch {
      console.error("The cart could not be parsed into JSON");
      return [];
    }
  });

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  function addToCart(id, sku) {
    setCart((items) => {
      const itemInCart = items.find((i) => i.sku === sku);
      //if item is already in the cart, were going to map over the items and replace them. our goal is to return a new array with the matching items replaced. we will return items.map, and for each item (i) we want to check if the item SKU matches the SKU of the item were trying to add to cart. using a tearnary operator, if the SKU matches the SKU passed in to addToCart weve found the item were lookfor and we want to increase the quantity of that item by one, otherwise return object untouched. we iterate over the array, and if weve found the item were looking for we return a copy of that item, but with quantity increased by one, AND if its not the item were looking for we return the item untouched
      if (itemInCart) {
        return items.map(
          (i) => (i.sku === sku ? { ...i, quantity: i.quantity + 1 } : i)
          //using spread object, increase quantity by 1
        );
      } else {
        //return new array with the new item appended
        return [...items, { id, sku, quantity: 1 }];
      }
    });
  }
  function updateQuantity(sku, quantity) {
    setCart((items) => {
      if (quantity === 0) {
        return items.filter((i) => i.sku !== sku);
      }
      return items.map((i) => (i.sku === sku ? { ...i, quantity } : i));
    });
  }

  function emptyCart() {
    setCart([]);
  }

  return (
    <>
      <div className="content">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<h1>Welcome to Carved Rock Fitness</h1>} />
            <Route path="/:category" element={<Products />} />
            <Route
              path="/:category/:id"
              element={<Detail addToCart={addToCart} />}
            />
            <Route
              path="/cart"
              element={<Cart cart={cart} updateQuantity={updateQuantity} />}
            />
            <Route
              path="/checkout"
              element={<Checkout cart={cart} emptyCart={emptyCart} />}
            />
          </Routes>
        </main>
      </div>
      <Footer />
    </>
  );
}
