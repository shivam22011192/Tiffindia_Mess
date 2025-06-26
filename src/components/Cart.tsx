
import React from 'react';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface CartProps {
  items: any[];
  onClose: () => void;
  onRemove: (itemId: number) => void;
  onUpdateQuantity: (itemId: number, quantity: number) => void;
  onCheckout: () => void;
  total: number;
}

const Cart = ({ items, onClose, onRemove, onUpdateQuantity, onCheckout, total }: CartProps) => {
  if (items.length === 0) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md p-6 text-center">
          <ShoppingBag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Your cart is empty</h3>
          <p className="text-gray-600 mb-4">Add some delicious thalis to get started!</p>
          <Button onClick={onClose}>Continue Shopping</Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-end justify-center p-4">
      <Card className="w-full max-w-lg max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b flex items-center justify-between sticky top-0 bg-white">
          <h3 className="text-lg font-semibold">Your Order ({items.length} items)</h3>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>
        
        <div className="p-4 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center space-x-3 py-3 border-b last:border-b-0">
              <img 
                src={item.image} 
                alt={item.name}
                className="w-12 h-12 rounded-lg object-cover"
              />
              
              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-600">{item.messName}</p>
                <p className="text-sm font-semibold text-orange-600">₹{item.price}</p>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  className="w-8 h-8 p-0"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                
                <span className="w-8 text-center font-medium">{item.quantity}</span>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  className="w-8 h-8 p-0"
                >
                  <Plus className="w-3 h-3" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => onRemove(item.id)}
                  className="text-red-600 hover:text-red-700 ml-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-4 border-t bg-gray-50 sticky bottom-0">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Total</span>
            <span className="text-xl font-bold text-orange-600">₹{total}</span>
          </div>
          
          <Button 
            onClick={onCheckout}
            className="w-full bg-orange-500 hover:bg-orange-600"
            size="lg"
          >
            Proceed to Checkout
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Cart;
