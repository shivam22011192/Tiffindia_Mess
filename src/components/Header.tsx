import React from "react";
import { ShoppingCart, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  shortAddress : String;
}

const Header = ({ cartCount, onCartClick, shortAddress }: HeaderProps) => {
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
              <MapPin className="w-4 h-4" />
              <span className="text-sm">{shortAddress}</span>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={onCartClick}
              className="relative"
            >
              <ShoppingCart className="w-4 h-4" />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
