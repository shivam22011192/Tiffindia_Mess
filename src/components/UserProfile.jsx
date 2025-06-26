
import React from 'react';
import { User, MapPin, Clock, Edit, Bike } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const UserProfile = ({
  user,
  currentAddress,
  deliveryAddressType,
  availableAddressTypes,
  onDeliveryAddressChange,
  onEditAddress
}) => {
  const now = new Date();
  const currentHour = now.getHours();
  const isBefore2PM = currentHour < 14;

  const deliveryTime = isBefore2PM
    ? "Lunch delivery time: 11:00 - 1:00 PM"
    : "Dinner delivery time: 7:00 - 9:00 PM";
  const orderBefore = isBefore2PM
    ? "Order before 10 AM"
    : "Order Before 6 PM";
  return (
    <Card className="p-4 sm:p-6 bg-gradient-to-r from-orange-500 to-amber-50 border border-orange-200 rounded-xl">
      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4 space-y-4 sm:space-y-0">
        {/* User Avatar */}

        {/* Info Section */}
        <div className="flex-1 space-y-2">
          {/* Welcome Message */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 truncate">
            Welcome, {user?.name || user?.phone || 'User'}!
          </h2>

          {/* Address Selector */}
          <div>
            <label className="text-sm text-gray-600 block mb-1">Deliver To:</label>
            <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 space-y-2 sm:space-y-0">
              <select
                value={deliveryAddressType}
                onChange={(e) => onDeliveryAddressChange(e.target.value)}
                className="text-sm bg-white border border-gray-300 rounded px-2 py-1 max-w-full sm:max-w-xs"
              >
                {availableAddressTypes.map(type => {
                  const address = user?.[`${type}Address`];
                  return (
                    <option key={type} value={type}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}: {address?.formattedAddress?.slice(0, 30) || ''}...
                    </option>
                  );
                })}
                <option value="addNewAddress">Add New Address</option>
              </select>
              <Button
                variant="outline"
                size="sm"
                onClick={onEditAddress}
                className="flex items-center"
              >
                <Edit className="w-3 h-3 mr-1" />
                Edit
              </Button>
            </div>
          </div>

          {/* Current Address Display */}
          <div className="flex items-start space-x-2 text-gray-600 text-sm break-words">
            <MapPin className="w-4 h-4 mt-0.5" />
            <span>
              {currentAddress?.formattedAddress?.slice(0, 50) || 'No address selected'}...
            </span>
          </div>

          {/* Delivery Time */}
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Bike className="w-4 h-4" />
            <span>{deliveryTime}</span>
          </div>
          <div className="flex items-center space-x-2 text-gray-600 text-sm">
            <Clock className="w-4 h-4" />
            <span>{orderBefore}</span>
          </div>
        </div>
      </div>
    </Card>

  );
};

export default UserProfile;
