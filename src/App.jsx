import React, { useState, useEffect } from "react";
import "./index.css";
import Header from "./components/Header";
import AutoPlay from "./components/Slider";
import MenuCart from "./components/MenuCart";
import PhoneInfoModal from "./components/PhoneInfoModal";
import Cart from "./components/Cart";

export default function App() {
  const [prodList, setProdList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для управления модальным окном
  const [selectedProduct, setSelectedProduct] = useState(null); // Состояние для хранения выбранного продукта
  const [searchInput, setSearchInput] = React.useState("");
  const [cartItems, setCartItems] = React.useState([]);

  const addToCart = (itemToAdd) => {
    setCartItems((prevItems) => [...prevItems, itemToAdd]);
    console.log("Товар добавлен в корзину:", itemToAdd);
  };

  const onChangeSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const tg = window.Telegram.WebApp;

  useEffect(() => {
    // Управление MainButton в зависимости от состояния корзины
    if (cartItems.length > 0) {
      tg.MainButton.setText("Перейти к оформлению");
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
  }, [cartItems, tg.MainButton]);

  const loadProducts = async () => {
    try {
      const response = await fetch("./prod_list.json");
      if (!response.ok) {
        console.log("Ошибка при загрузке данных");
      }
      const data = await response.json();
      setProdList(data);
    } catch (error) {
      console.error("Ошибка:", error);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Отключаем прокрутку документа при открытии модального окна
  // Отключаем прокрутку документа при открытии модального окна
  useEffect(() => {
    const body = document.body;
    if (isModalOpen) {
      body.style.overflow = "hidden";
    } else {
      body.style.overflow = "auto";
    }

    // Очистка эффекта при размонтировании компонента
    return () => {
      body.style.overflow = "auto";
    };
  }, [isModalOpen]);

  // Функция для открытия модального окна
  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  // Функция для закрытия модального окна
  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <>
      <PhoneInfoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        product={selectedProduct}
        items={cartItems}
        addToCart={addToCart}
      />
      <Cart cartItems={cartItems} />
      <div className="container w-full h-screen pt-4 px-2">
        {/* Передаем данные о продукте */}
        <div className="">
          <Header />
          <h1 className="text-3xl font-bold text-black text-center mb-6">
            Что нового?
          </h1>
          {!isModalOpen && <AutoPlay />}
          <div className="scrollbar_categories overflow-x-scroll whitespace-nowrap scrollbar-hide scrollbar-w mt-6">
            <div className="flex">
              <img
                className="font-bold text-lg h-10 bg-[#F1F1F1] px-4 py-2 rounded-full mr-3"
                src="src/assets/Filter.svg"
                alt=""
              ></img>
              <p className="font-bold text-lg text-black bg-[#F1F1F1] px-4 py-2 rounded-2xl mr-3">
                Iphone
              </p>
              <p className="text-lg text-black bg-[#F1F1F1]  px-4 py-2 rounded-2xl mr-3">
                Macbook
              </p>
              <p className="text-lg text-black bg-[#F1F1F1]  px-4 py-2 rounded-2xl mr-3">
                AirPods
              </p>
              <p className="text-lg text-black bg-[#F1F1F1]  px-4 py-2 rounded-2xl mr-3">
                Аксесуары
              </p>
            </div>
          </div>
          <div className="text-center mt-8 bg-gray-100 items-center flex px-2 py-3 border-2 border-gray-400 rounded-xl">
            <img className="h-6 mr-6 ml-6" src="src/assets/loop.svg" alt="" />
            <input
              value={searchInput}
              onChange={onChangeSearchInput}
              className="bg-transparent focus:outline-none text-lg"
              placeholder="Поиск"
              type="text"
              name=""
              id=""
            />
          </div>
          <div className="justify-center grid grid-cols-2 gap-2 text-black mt-10">
            {prodList
              .filter((item) =>
                item.model.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((item, index) => (
                <div key={index}>
                  {item.model && (
                    <div onClick={() => openModal(item)}>
                      {/* Открытие модального окна при клике */}
                      <MenuCart
                        key={index}
                        name={item.model}
                        price={item.variants[0].specs[0].price}
                        imageSrc={item.variants[0].image}
                      />
                    </div>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </>
  );
}
