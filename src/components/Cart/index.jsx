import React from "react";

export default function Cart({ cartItems, removeFromCart }) {
  return (
    <div className="container pt-8 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-bold uppercase">Корзина</h1>
        <button>
          <img className="h-8" src="/src/assets/close.svg" alt="" />
        </button>
      </div>
      <div>
        {cartItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between border-2 rounded-xl px-2 py-2 shadow-md mb-4"
          >
            <div className="flex">
              <img
                className="h-16 mr-2"
                src={item.image} // Предполагая, что изображение продукта есть в объекте
                alt={item.model}
              />
              <div>
                <h3 className="font-bold">
                  {item.model} - {item.memory}
                </h3>
                <p>Цвет: {item.color}</p>
                <p className="font-bold">{item.price} руб</p>
              </div>
            </div>
            <button onClick={() => removeFromCart(item.id)}>
              <img className="h-8" src="/src/assets/delete.svg" alt="" />
            </button>
          </div>
        ))}
        {cartItems.length === 0 && <p>Ваша корзина пуста</p>}
      </div>
    </div>
  );
}
