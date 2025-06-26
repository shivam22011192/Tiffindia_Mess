import React from "react";
import {
  ArrowLeft,
  Star,
  Clock,
  MapPin,
  Plus,
  Minus,
  Trash2,
  Utensils,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface Thali {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  isVeg: boolean;
  popular: boolean;
}

interface CartItem {
  messThaliID: string;
  quantity: number;
}

interface MessDetailsProps {
  mess: {
    id: string;
    name: string;
    rating: number;
    reviews: number;
    distance: string;
    deliveryTime: string;
    cuisine: string;
    price: string;
    image: string;
    specialties: string[];
    isOpen: boolean;
    thalis: Thali[];
  };
  onBack: () => void;
  onAddToCart: (item: { id: string }) => void;
  cartItems: CartItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onClearCart: () => void;
  checkOut: () => void
}

const MessDetails = ({
  mess,
  onBack,
  onAddToCart,
  cartItems,
  onUpdateQuantity,
  onClearCart,
  checkOut
}: MessDetailsProps) => {
  const getCartQuantity = (thaliId: string) => {
    const item = cartItems.find((item) => item.messThaliID === thaliId);
    return item?.quantity || 0;
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const thali = mess.thalis.find((t) => t.id === item.messThaliID);
      return total + (thali ? thali.price * item.quantity : 0);
    }, 0);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Please select at least one item to checkout.");
      return;
    }

    const orderSummary = cartItems
      .map((item) => {
        const thali = mess.thalis.find((t) => t.id === item.messThaliID);
        return `${thali?.name} x ${item.quantity} = ₹${
          thali ? thali.price * item.quantity : 0
        }`;
      })
      .join("\n");

    alert(
      `Order from ${
        mess.name
      }:\n\n${orderSummary}\n\nTotal: ₹${getTotalPrice()}`
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Messes
      </Button>

      {/* Mess Header */}
      <Card className="p-6 mb-6">
        <div className="flex items-start space-x-6">
          <img
            src={mess.image}
            alt={mess.name}
            className="w-32 h-32 rounded-lg object-cover"
          />

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              {mess.name}
            </h1>


            <div className="flex items-left space-x-6 text-sm text-gray-600 mb-4" style={{display : 'flex', flexDirection : 'column'}}>


              <div className="flex items-left space-x-1">
                <Utensils className="w-4 h-4" />
                <span>{mess.daily_Menus.menuContents}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {mess.specialties.map((specialty, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className={`${
                    specialty === "Pure Veg" ? "border-green-500 text-green-600" : "border-red-500 text-red-600"
                  }`}
                >
                  {specialty}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Thali Menu */}
      <Card className="p-6">
        <h2 className="text-xl font-semibold mb-4">Available Thalis</h2>

        <div className="grid gap-4">
          {mess.thalis.map((thali) => {
            const cartQty = getCartQuantity(thali.id);

            return (
              <div
                key={thali.id}
                className="flex items-center space-x-4 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <img
                  src={thali.image}
                  alt={thali.name}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className="font-semibold">{thali.name}</h3>
                    {thali.popular && (
                      <Badge className="bg-orange-100 text-orange-700">
                        Popular
                      </Badge>
                    )}

                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {thali.description}
                  </p>
                  <div className="text-lg font-bold text-orange-600">
                    ₹{thali.price}
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {cartQty > 0 ? (
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(thali.id, cartQty - 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Minus className="w-3 h-3" />
                      </Button>
                      <span className="w-8 text-center font-medium">
                        {cartQty}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onUpdateQuantity(thali.id, cartQty + 1)}
                        className="w-8 h-8 p-0"
                      >
                        <Plus className="w-3 h-3" />
                      </Button>
                    </div>
                  ) : (
                    <Button
                      onClick={() => onAddToCart({ id: thali.id })}
                      className="bg-orange-500 hover:bg-orange-600"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Cart Summary */}
        {cartItems.length > 0 && (
          <div className="mt-6 border-t pt-6">
            <div className="flex justify-between items-center mb-4">
              <h4 className="text-lg font-semibold">
                Cart Summary ({getTotalItems()} items)
              </h4>
              <Button
                variant="outline"
                size="sm"
                onClick={onClearCart}
                className="text-red-600 hover:text-red-700"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear Cart
              </Button>
            </div>

            {cartItems.map((item) => {
              const thali = mess.thalis.find((t) => t.id === item.messThaliID);
              if (!thali) return null;

              return (
                <div
                  key={item.messThaliID}
                  className="flex justify-between items-center py-2"
                >
                  <span>
                    {thali.name} x {item.quantity}
                  </span>
                  <span className="font-semibold">
                    ₹{thali.price * item.quantity}
                  </span>
                </div>
              );
            })}

            <div className="border-t pt-2 mt-4">
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total:</span>
                <span className="text-orange-600">₹{getTotalPrice()}</span>
              </div>
            </div>

            <Button
              onClick={checkOut}
              className="w-full mt-4 bg-green-500 hover:bg-green-600"
              size="lg"
            >
              Proceed to Checkout
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
};

export default MessDetails;
