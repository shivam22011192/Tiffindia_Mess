import React, { useState } from "react";
import {
  ArrowLeft,
  MapPin,
  Clock,
  CreditCard,
  Wallet,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";

interface CheckoutProps {
  cartItems: any[];
  total: number;
  onBack: () => void;
  currentDeliveryAddress: object;
  selectedMess: object;
  availableMesses : any[];
}

const Checkout = ({
  cartItems,
  total,
  onBack,
  currentDeliveryAddress,
  selectedMess,
  availableMesses
}: CheckoutProps) => {
  const [deliveryAddress, setDeliveryAddress] = useState(
    `${currentDeliveryAddress.areaStreet},  ${currentDeliveryAddress.flatBuilding},  ${currentDeliveryAddress.landmark},  ${currentDeliveryAddress.city}-${currentDeliveryAddress.pincode}`
  );
  const [paymentMethod, setPaymentMethod] = useState("wallet");
  const [specialInstructions, setSpecialInstructions] = useState("");

  const deliveryFee = 25;
  const platformFee = 5;
  const finalTotal = total;

  const handlePlaceOrder = () => {
    console.log("Order placed successfully! You will receive a confirmation shortly.",
      currentDeliveryAddress,cartItems,total,selectedMess
    )
    // Simulate order placement
    alert(
      "Order placed successfully! You will receive a confirmation shortly."
    );
    onBack();
  };
  const now = new Date();
  const currentHour = now.getHours();
  const isBefore2PM = currentHour < 14;
  if(selectedMess == undefined){
    for(let element of availableMesses){
      if(element.messID == cartItems[0].messID){
        selectedMess = element
      }
    }
  }
  const day = now.getDate();
  const month = now.toLocaleString("default", { month: "long" }); // e.g., "June"
  const year = now.getFullYear();

  const orderingFor = `${
    isBefore2PM ? "Lunch" : "Dinner"
  } ${day}-${month}-${year}`;
  const orderBefore = isBefore2PM ? "11:00 - 1:00 PM" : "7:00 - 9:00 PM";

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      <Button variant="ghost" onClick={onBack} className="mb-4">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to Cart
      </Button>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Order Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Delivery Address */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Delivery Address
            </h3>
            <Textarea value={deliveryAddress} rows={3} />
          </Card>

          {/* Delivery Time */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Ordering For - {orderingFor}
            </h3>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2" />
              Delivery Between - {orderBefore}
            </h3>
          </Card>

          {/* Payment Method */}
          {/* <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <CreditCard className="w-5 h-5 mr-2" />
              Payment Method
            </h3>
            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="wallet" id="wallet" />
                  <Label htmlFor="wallet" className="flex items-center">
                    <Wallet className="w-4 h-4 mr-2" />
                    Wallet
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="card" id="card" />
                  <Label htmlFor="card">Credit/Debit Card</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="upi" id="upi" />
                  <Label htmlFor="upi">UPI</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="cod" id="cod" />
                  <Label htmlFor="cod">Cash on Delivery</Label>
                </div>
              </div>
            </RadioGroup>
          </Card> */}

          {/* Special Instructions */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Special Instructions</h3>
            <Textarea
              placeholder="Any special requests for your order..."
              value={specialInstructions}
              onChange={(e) => setSpecialInstructions(e.target.value)}
              rows={3}
            />
          </Card>
        </div>

        {/* Order Summary */}
        <div>
          <Card className="p-6 sticky top-6">
            <h3 className="text-lg font-semibold mb-4">Order Summary</h3>
            <div>
              <div className="text-lg font-semibold mb-1">
                {selectedMess.messName}
              </div>
              <div className="text-sm font-semibold mb-4">
                {selectedMess.Daily_Menus.menuContents}
              </div>
            </div>
            <div className="space-y-3 mb-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>
                    {item.name} × {item.quantity}
                  </span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>₹{total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Delivery Fee</span>
                <span>
                  <del className="text-gray-500">₹{deliveryFee}</del>{" "}
                  <span className="text-green-600">Free</span>
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span>Platform Fee</span>
                <span>
                  <del className="text-gray-500">₹{platformFee}</del>{" "}
                  <span className="text-green-600">Free</span>
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Handling Charge</span>
                <span>
                  <del className="text-gray-500">₹3</del>{" "}
                  <span className="text-green-600">Free</span>
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span className="text-orange-600">₹{finalTotal}</span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              className="w-full mt-6 bg-orange-500 hover:bg-orange-600"
              size="lg"
            >
              Place Order - ₹{finalTotal}
            </Button>

            <p className="text-xs text-gray-500 mt-3 text-center">
              By placing this order, you agree to our terms and conditions
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
