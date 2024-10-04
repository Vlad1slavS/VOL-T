import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

const PhoneInfoModal = ({ isOpen, onClose, product, addToCart }) => {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [selectedMemoryIndex, setSelectedMemoryIndex] = useState(0);

  if (!isOpen || !product) return null; // Если модальное окно закрыто или продукта нет, ничего не отображаем

  // Получаем выбранный цвет и память
  const selectedVariant = product.variants[selectedColorIndex];
  const selectedSpec = selectedVariant.specs[selectedMemoryIndex];

  const handleAddToCart = () => {
    const itemToAdd = {
      id: uuidv4(),
      model: product.model,
      color: selectedVariant.color,
      memory: selectedSpec.memory,
      price: selectedSpec.price,
      image: selectedVariant.image,
    };

    addToCart(itemToAdd); // Используем переданную функцию для добавления в корзину
    onClose(); // Закрываем модальное окно после добавления
  };

  return (
    <div className="fixed w-screen flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white overflow-y-auto w-full h-screen">
        <img
          onClick={onClose}
          className="h-8 mt-6 inline-block pl-4"
          src="src/assets/back_Arrow.svg"
          alt=""
        />
        <div className="text-center">
          <div className="flex justify-center">
            <img
              className="h-80"
              src={selectedVariant.image} // Выбор изображения для показа
              alt={product.model}
            />
          </div>
          <h1 className="text-center font-bold text-lg">{product.model}</h1>
          <h3 className="font-semibold text-xl">{selectedSpec.price} руб</h3>
          <div>
            <h3
              className={
                selectedSpec.status === "В наличии"
                  ? "text-green-500 font-semibold"
                  : "text-red-500 font-semibold"
              }
            >
              {selectedSpec.status}
            </h3>
          </div>

          {/* Доступные цвета */}
          <h3 className="font-semibold text-lg mt-2">Доступные цвета:</h3>
          <div className="flex justify-center">
            {product.variants.map((variant, index) => (
              <div
                key={index}
                onClick={() => setSelectedColorIndex(index)}
                className={`cursor-pointer p-2 m-1 rounded ${
                  index === selectedColorIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {variant.color}
              </div>
            ))}
          </div>

          {/* Варианты памяти */}
          <h3 className="font-semibold text-lg mt-2">Варианты памяти:</h3>
          <div className="flex justify-center">
            {selectedVariant.specs.map((spec, index) => (
              <div
                key={index}
                onClick={() => setSelectedMemoryIndex(index)}
                className={`cursor-pointer p-2 m-1 rounded ${
                  index === selectedMemoryIndex
                    ? "bg-blue-500 text-white"
                    : "bg-gray-300 text-black"
                }`}
              >
                {spec.memory}
              </div>
            ))}
          </div>

          <button
            onClick={handleAddToCart}
            className="mt-4 bg-gray-300 rounded py-2 px-4"
          >
            "В корзину"
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhoneInfoModal;
