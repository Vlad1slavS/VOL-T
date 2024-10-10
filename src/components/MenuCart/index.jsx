import React from "react";

export default function MenuCart(props) {
  return (
    <>
      <div className="category_item flex flex-col items-center mb-10 text-center rounded-2xl p-3 shadow-md border-2">
        <a>
          <img className="h-36" src={props.imageSrc} alt=""></img>
        </a>
        <a className="mt-2 mb-1 text-sm leading-4">{props.name}</a>
        <p className="font-bold text-md">
          <b className="font-normal">от</b> {props.price} руб
        </p>
      </div>
    </>
  );
}
