import React, { useState, useEffect } from "react";
import "./index.css";
import Header from "./components/Header";
import AutoPlay from "./components/Slider";
import MenuCart from "./components/MenuCart";
import PhoneInfoModal from "./components/PhoneInfoModal";
import Cart from "./components/Cart";

export default function App() {
  // const [prodList, setProdList] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false); // Состояние для управления модальным окном
  const [isCartOpen, setIsCartOpen] = useState(false); // Состояние для видимости корзины
  const [selectedProduct, setSelectedProduct] = useState(null); // Состояние для хранения выбранного продукта
  const [searchInput, setSearchInput] = React.useState("");
  const [cartItems, setCartItems] = useState(() => {
    const savedCartItems = localStorage.getItem("VOLTCart");
    return savedCartItems ? JSON.parse(savedCartItems) : [];
  });
  const [selectedCategory, setSelectedCategory] = React.useState("Iphone");

  const prodList = [
    {
      category: "Iphone",
      model: "iPhone 16 PRO MAX",
      variants: [
        {
          color: "Desrt-Gold",
          specs: [
            {
              memory: "128Гб",
              price: 700,
              status: "В наличии",
            },
            {
              memory: "256Гб",
              price: 1000,
              status: "Предзаказ",
            },
          ],
          image: "src/assets/phones/16PM/GoldDesert16PM.png",
        },
        {
          color: "Black",
          specs: [
            {
              memory: "128Гб",
              price: 1000,
              status: "Под заказ",
            },
            {
              memory: "256Гб",
              price: 2000,
              status: "Под заказ",
            },
            {
              memory: "512Гб",
              price: 3000,
              status: "Под заказ",
            },
            {
              memory: "1Тб",
              price: 4000,
              status: "Под заказ",
            },
          ],
          image: "src/assets/phones/16PM/BlackTitanium16PM.png",
        },
      ],
    },
    {
      category: "Iphone",
      model: "iPhone 16",
      variants: [
        {
          color: "Ultramarin",
          specs: [
            {
              memory: "256Гб",
              price: 2000,
              status: "В наличии",
            },
            {
              memory: "512Гб",
              price: 5000,
              status: "В наличии",
            },
          ],
          image: "src/assets/phones/16/Ultramarine16.png",
        },
        {
          color: "Black",
          specs: [
            {
              memory: "128Гб",
              price: 15000,
              status: "В наличии",
            },
          ],
          image: "111",
        },
        {
          color: "Green",
          specs: [
            {
              memory: "128Гб",
              price: 16000,
              status: "В наличии",
            },
          ],
          image: "111",
        },
      ],
    },
    {
      category: "Iphone",
      model: "iphone 15",
      variants: [
        {
          color: "Green",
          specs: [
            {
              memory: "128Гб",
              price: 54000,
              status: "В наличии",
            },
          ],
          image: "13333",
        },
      ],
    },
  ];

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

  // Вызов функции
  const totalPrepayment = calculatePrepaymentAmount(cartItems);
  console.log(`Сумма предоплаты: ${totalPrepayment} руб`);

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
      tg.MainButton.setText("Показать корзину");
      tg.MainButton.onClick(() => setIsCartOpen(true));
      if (isCartOpen) {
        const totalPrepayment = calculatePrepaymentAmount(cartItems);
        tg.MainButton.setText(`Предоплата ${totalPrepayment}`);
        tg.MainButton.onClick();
      }
      tg.MainButton.show();
    } else {
      tg.MainButton.hide();
    }
    // Очистка обработчика events прикрепленного к MainButton
    return () => {
      tg.MainButton.offClick();
    };
  }, [cartItems, tg.MainButton]);

  // const loadProducts = async () => {
  //   try {
  //     const response = await fetch("./prod_list.json");
  //     if (!response.ok) {
  //       console.log("Ошибка при загрузке данных");
  //     }
  //     const data = await response.json();
  //     setProdList(data);
  //   } catch (error) {
  //     console.error("Ошибка:", error);
  //   }
  // };

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
          <button onClick={() => setIsCartOpen(true)}>1111</button>
          {!isModalOpen && !isCartOpen && <AutoPlay />}
          <div className="scrollbar_categories overflow-x-scroll whitespace-nowrap scrollbar-hide scrollbar-w mt-6">
            <div className="flex">
              <img
                className="font-bold text-lg h-10 bg-[#F1F1F1] px-4 py-2 rounded-full mr-3"
                src="src/assets/Filter.svg"
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
              .filter((item) => item.category === selectedCategory)
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
