import React, { useState, useEffect } from "react";
import "./index.css";
import Header from "./components/Header";
import AutoPlay from "./components/Slider";
import MenuCart from "./components/MenuCart";
import PhoneInfoModal from "./components/PhoneInfoModal";
import Cart from "./components/Cart";
import axios from "axios";

export default function App() {
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для управления модальным окном
  const [isCartOpen, setIsCartOpen] = useState(false); // Состояние для видимости корзины
  const [selectedProduct, setSelectedProduct] = useState(null); // Состояние для хранения выбранного продукта
  const [searchInput, setSearchInput] = React.useState("");
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("VOLTCart");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  const [selectedCategory, setSelectedCategory] = React.useState("Iphone");
  const [products, setProducts] = useState([]);

  const fetchProducts = async () => {
    try {
      const response = await axios.get("http://localhost:8000/products");
      const data = response.data; // Axios автоматически парсит JSON
      const iPhones = Object.values(data);
      console.log(data);
      setProducts(iPhones); // обновляем состояние products
    } catch (error) {}
  };

  useEffect(() => {
    fetchProducts();
  }, []); // добавляем пустой массив зависимостей, чтобы функция вызывалась только один раз

  // Функция для вычисления суммы предоплаты
  const calculatePrepaymentAmount = (cartItems) => {
    return cartItems.reduce((totalPrepayment, item) => {
      // Предполагается, что item.type содержит категорию товара (iphone, macbook, ipad, airpods, аксессуар)
      const itemType = item.category.toLowerCase();

      // Проверяем тип товара и назначаем соответствующую сумму предоплаты
      if (
        itemType === "iphone" ||
        itemType === "macbook" ||
        itemType === "ipad"
      ) {
        return totalPrepayment + 5000; // добавляем 5000 за каждый товар из этой категории
      } else if (itemType === "airpods" || itemType === "аксессуар") {
        return totalPrepayment + 2000; // добавляем 2000 за каждый товар из этой категории
      } else {
        return totalPrepayment;
      }
    }, 0);
  };

  useEffect(() => {
    localStorage.setItem("VOLTCart", JSON.stringify(cartItems));
  }, [cartItems]);

  const saveCartToLocalStorage = () => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  };

  // Загрузка корзины из localStorage
  const loadCartFromLocalStorage = () => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCartItems(JSON.parse(storedCart));
    }
  };

  const addToCart = (itemToAdd) => {
    setCartItems((prevItems) => [...prevItems, itemToAdd]);
  };

  const removeFromCart = (itemId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== itemId));
  };

  const onChangeSearchInput = (event) => {
    setSearchInput(event.target.value);
  };

  const tg = window.Telegram.WebApp;

  // Управление MainButton в зависимости от состояния корзины
  useEffect(() => {
    if (cartItems.length > 0) {
      if (isCartOpen) {
        const totalPrepayment = calculatePrepaymentAmount(cartItems);
        tg.MainButton.setText(`Предоплата ${totalPrepayment}`);
        tg.MainButton.onClick(async () => {
          try {
            const response = await fetch(
              `https://api.telegram.org/`,
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  title: "Предоплата вашего заказа",
                  description: "Заказ",
                  payload: "some-payload",
                  provider_token:
                    "401643678:TEST:52b29ae0-2cac-4077-83f5-f7670e014f5b",
                  currency: "RUB",
                  prices: [
                    {
                      label: "Предоплата",
                      amount: 1000 * 100,
                    },
                  ],
                  start_parameter: "payment",
                }),
              }
            );
            if (response.ok) {
              const data = await response.json();
              if (data.ok && data.result) {
                window.open(data.result, "_blank");
              } else {
                alert("Ошибка при создании инвойса: некорректный ответ");
              }
            } else {
              console.error("Ответ с ошибкой:", await response.text()); // Логируем текст ошибки
              alert("Не удалось отправить запрос на сервер");
            }
          } catch (error) {
            console.error("Ошибка при создании инвойса:", error);
            alert("Возникла ошибка при создании инвойса");
          }
        });
      } else {
        tg.MainButton.setText("Показать корзину");
        tg.MainButton.onClick(() => setIsCartOpen(true));
      }
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
    // Очистка обработчика events прикрепленного к MainButton
    return () => {
      tg.MainButton.offClick();
    };
  }, [cartItems, isCartOpen, tg.MainButton]);

  useEffect(() => {
    // loadProducts();
    loadCartFromLocalStorage();
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
      <Cart
        cartItems={cartItems}
        removeFromCart={(itemId) => removeFromCart(itemId)}
        onClose={() => setIsCartOpen(false)} // Закрываем корзину
        isOpen={isCartOpen}
      />
      <div className="container w-full h-screen pt-4 px-2 overflow-x-hidden">
        {/* Передаем данные о продукте */}
        <div className="">
          <Header />
          <h1 className="text-3xl font-bold text-black text-center mb-6">
            Что нового?
          </h1>
          {!isModalOpen && !isCartOpen && <AutoPlay />}
          <div className="scrollbar_categories overflow-x-scroll whitespace-nowrap scrollbar-hide scrollbar-w mt-6">
            <div className="flex">
              <img
                className="font-bold text-lg h-10 bg-[#F1F1F1] px-4 py-2 rounded-full mr-3"
                src="./assets/Filter.svg"
                alt=""
              ></img>
              <button
                className={` text-lg h-10 bg-[#F1F1F1] px-4 py-2 rounded-xl mr-3 ${
                  selectedCategory === "Iphone" ? "bg-[#e1e1e1] font-bold" : ""
                }`}
                onClick={() => setSelectedCategory("Iphone")}
              >
                Iphone
              </button>
              <button
                className={`text-lg text-black bg-[#F1F1F1]  px-4 py-2 rounded-xl mr-3 ${
                  selectedCategory === "Macbook" ? "bg-[#e1e1e1] font-bold" : ""
                }`}
                onClick={() => setSelectedCategory("Macbook")}
              >
                Macbook
              </button>
              <button
                className={`text-lg text-black bg-[#F1F1F1]  px-4 py-2 rounded-xl mr-3 ${
                  selectedCategory === "AirPods" ? "bg-[#e1e1e1] font-bold" : ""
                }`}
                onClick={() => setSelectedCategory("AirPods")}
              >
                AirPods
              </button>
              <button
                className={`text-lg text-black bg-[#F1F1F1]  px-4 py-2 rounded-xl mr-3 ${
                  selectedCategory === "Аксесуары"
                    ? "bg-[#e1e1e1] font-bold"
                    : ""
                }`}
                onClick={() => setSelectedCategory("Аксесуары")}
              >
                Аксесуары
              </button>
            </div>
          </div>
          <div className="text-center mt-8 bg-gray-100 items-center flex px-2 py-3 border-2 border-gray-400 rounded-xl">
            <img className="h-6 mr-6 ml-6" src="./assets/loop.svg" alt="" />
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
            {products
              .filter(
                (item) =>
                  item.category.toLowerCase() === selectedCategory.toLowerCase()
              )
              .filter((item) =>
                item.model.toLowerCase().includes(searchInput.toLowerCase())
              )
              .map((item) =>
                item.variants.length > 0 ? ( // Проверка, есть ли варианты
                  <div key={item.model}>
                    {" "}
                    {/* Используйте model в качестве уникального ключа */}
                    <div onClick={() => openModal(item)}>
                      <MenuCart
                        name={item.model}
                        price={item.variants[0].specs[0].price} // Выбираем первую спецификацию
                        imageSrc={item.variants[0].image} // Берём изображение первого варианта
                      />
                    </div>
                  </div>
                ) : null
              )}
          </div>
        </div>
      </div>
    </>
  );
}
