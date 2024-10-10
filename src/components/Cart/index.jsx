import React from "react";
import "./style.css";

export default function Cart({ isOpen, onClose, cartItems, removeFromCart }) {
  if (!isOpen) return null;
  return (
    <div className="fixed w-screen flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white overflow-y-auto w-full h-screen p-6 cart-container">
        <img
          onClick={onClose}
          className="h-8 mb-6 cursor-pointer"
          src="./assets/close.svg"
          alt="Back"
        />
        <h1 className="text-center font-bold text-lg mb-4">Корзина</h1>
        {cartItems.length > 0 ? (
          cartItems.map((item, index) => (
            <div
              key={index}
              className="flex justify-between mb-4 border-b pb-2"
            >
              <div className="flex items-center">
                <img
                  className="h-16 mr-4"
                  src={item.image} // Используем изображение товара
                  alt={item.model}
                />
                <div>
                  <h3 className="font-bold">{item.model}</h3>
                  <p>Цвет: {item.color}</p>
                  <p>Память: {item.memory}</p>
                  <p className="font-semibold">{item.price} руб</p>
                </div>
              </div>
              <button onClick={() => removeFromCart(item.id)}>
                <img
                  className="h-8"
                  src="./assets/delete.svg"
                  alt="Удалить"
                />
              </button>
            </div>
          ))
        ) : (
          <p className="text-center">Ваша корзина пуста</p>
        )}
      </div>
    </div>
  );
}
