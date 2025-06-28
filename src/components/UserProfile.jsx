
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
<Card className="p-6 bg-white border border-gray-200 rounded-2xl shadow-lg max-w-xl mx-auto sm:max-w-full sm:px-8">
  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
    {/* Left Section - Name & Type */}
    <div className="sm:w-1/3 text-gray-900">
      <h2 className="text-2xl font-semibold flex items-center gap-3">
        <Building2 className="w-6 h-6 text-orange-500" />
        <span>{messDeatils.messName} </span>
      </h2>
      {messDeatils.messType == "Pure Veg" ? <p className="mt-2 flex items-center gap-2 text-green-600 font-medium text-sm sm:text-base">
        <UtensilsCrossed className="w-5 h-5" />
        <span>{messDeatils.messType}</span>
      </p> :
      <p className="mt-2 flex items-center gap-2 text-red-600 font-medium text-sm sm:text-base">
        <UtensilsCrossed className="w-5 h-5" />
        <span>{messDeatils.messType}</span>
      </p>
      }
    </div>
    {/* Right Section - Info */}
    <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700 text-sm sm:text-base">
      <div className="flex items-center gap-2">
        <BadgeInfo className="w-5 h-5 text-orange-500" />
        <div>
          <p className="font-semibold text-gray-900">Mess ID</p>
          <p>{messDeatils.messID}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <User className="w-5 h-5 text-orange-500" />
        <div>
          <p className="font-semibold text-gray-900">Owner</p>
          <p>{messDeatils.messOwnername}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Phone className="w-5 h-5 text-orange-500" />
        <div>
          <p className="font-semibold text-gray-900">Phone</p>
          <p>+{messDeatils.phone}</p>
        </div>
      </div>
    </div>
  </div>
</Card>


  );
};

export default messDeatilsProfile;
