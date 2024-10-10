import React from "react";
import Slider from "react-slick";

function AutoPlay() {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    cssEase: "linear",
  };

  const slider_items = [
    {
      title: "Iphone 16",
      image_link: "./assets/iPhone16P.png",
      description: "Еще больше возможностей",
    },
    {
      title: "IPad Pro",
      image_link: "./assets/iPad.png",
      description: "Ваше творчество без границ",
    },
    {
      title: "MacBook",
      image_link: "./assets/Mac.png",
      description: "Мощь и портативность",
    },
  ];

  return (
    <div className="slider-container">
      <Slider {...settings}>
        {slider_items.map((item, index) => (
          <div className="" key={index}>
            <div className="bg-black max-w-md mx-auto flex justify-between px-3 items-center py-10 rounded-2xl mb-6">
              <div className="text-white">
                <h2 className="inline-block text-3xl font-bold ">
                  {item.title}
                </h2>
                <p className="text-left text-sm">{item.description}</p>
              </div>
              <div>
                <img className="h-28" src={item.image_link} alt={item.title} />
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
}

export default AutoPlay;
