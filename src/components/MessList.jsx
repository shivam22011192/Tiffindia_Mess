
import React from 'react';
import { Star, Clock, MapPin, Leaf, Drumstick } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const MessList = ({ messes = [], onSelectMess }) => {
  // Add safety check for messes array
  if (!Array.isArray(messes)) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center mb-6">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="px-4 text-gray-600 font-semibold">Loading messes...</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-center mb-6">
        <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#ccc' }}></div>
        <span className="px-4 text-gray-600 font-semibold">Messes near you</span>
        <div style={{ flexGrow: 1, height: '1px', backgroundColor: '#ccc' }}></div>
      </div>

      <h3 className="text-lg font-semibold">Available Messes ({messes.length})</h3>
      {messes.map((mess) => (
        <Card
          key={mess.id}
          className={`p-4 cursor-pointer transition-all hover:shadow-lg ${!mess.isOpen ? 'opacity-60' : ''}`}
          onClick={() => mess.isOpen && onSelectMess(mess)}
        >
          <div className="flex space-x-4">
            <img
              src={mess.image}
              alt={mess.name}
              className="w-20 h-20 rounded-lg object-cover"
            />

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-semibold text-gray-800">{mess.name}</h4>
                  <p className="text-sm text-gray-700">{mess.daily_Menus}</p>
                </div>
                {!mess.isOpen && (
                  <Badge variant="secondary" className="bg-red-100 text-red-700">
                    Closed
                  </Badge>
                )}
                <div className="flex items-center space-x-2">
                  {/* Icons */}
                  {mess.cuisine === "Pure Veg" ? (
                    <Leaf className="w-4 h-4 text-green-600" />
                  ) : (
                    <Drumstick className="w-4 h-4 text-red-600" />
                  )}

                  {/* Badge */}
                  <Badge
                    variant="outline"
                    className={`${mess.cuisine === "Pure Veg"
                        ? "border-green-500 text-green-600"
                        : "border-red-500 text-red-600"
                      }`}
                  >
                    {mess.cuisine === "Pure Veg"
                        ? "Veg"
                        : "Mix"
                    }
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default MessList;
