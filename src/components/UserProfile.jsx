
import React from 'react';
import { Card } from '@/components/ui/card';
import {
  Building2,
  BadgeInfo,
  User,
  Phone,
  UtensilsCrossed,
} from "lucide-react";

const messDeatilsProfile = ({
  messDeatils
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
<Card className="p-6 bg-gradient-to-r from-orange-500 to-amber-50 border border-orange-200 rounded-xl shadow-md">
      <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-8 space-y-4 sm:space-y-0">
        {/* Left Section - Name & Type */}
        <div className="text-white sm:w-1/3">
          <h2 className="text-xl font-bold flex items-center space-x-2">
            <Building2 className="w-5 h-5" />
            <span>{messDeatils.messName}</span>
          </h2>
          <p className="text-sm flex items-center space-x-2 mt-1 text-orange-100">
            <UtensilsCrossed className="w-4 h-4" />
            <span>{messDeatils.messType}</span>
          </p>
        </div>

        {/* Right Section - Info */}
        <div className="flex-1 space-y-3 text-sm text-gray-800">
          <div className="flex items-center space-x-2">
            <BadgeInfo className="w-4 h-4 text-orange-700" />
            <span className="font-medium text-gray-900">Mess ID:</span>
            <span>{messDeatils.messID}</span>
          </div>
          <div className="flex items-center space-x-2">
            <User className="w-4 h-4 text-orange-700" />
            <span className="font-medium text-gray-900">Owner:</span>
            <span>{messDeatils.messOwnername}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Phone className="w-4 h-4 text-orange-700" />
            <span className="font-medium text-gray-900">Phone:</span>
            <span>+{messDeatils.phone}</span>
          </div>
        </div>
      </div>
    </Card>

  );
};

export default messDeatilsProfile;
