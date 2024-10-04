import React from "react";

export default function Header() {
  return (
    <div>
      <header className=" h-16 flex items-center justify-center mb-6 ">
        <div className="flex items-center">
          <img className="h-10 w-10 mr-2" src="src/assets/battery.svg" alt="" />
          <h1 className="text-3xl font-bold text-black">КАТАЛОГ</h1>
        </div>
      </header>
    </div>
  );
}
