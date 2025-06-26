import React from "react";
import {Warehouse } from "lucide-react";

interface HeaderProps {
  messDeatils : object;
}

const Header = ({ messDeatils }: HeaderProps) => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-14 h-14 rounded-lg flex items-center justify-center">
              <img
                src="./images/TIFFINIDA LOGO.png" // Replace with your actual logo URL
                alt="Logo"
                className="w-100 h-100 object-contain"
              />
            </div>
            <h1 className="text-xl font-bold text-gray-800">TIFFINDIA</h1>
          </div>

          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <Warehouse className="w-4 h-4" />
              <span className="text-sm text-black">{messDeatils.messName}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
