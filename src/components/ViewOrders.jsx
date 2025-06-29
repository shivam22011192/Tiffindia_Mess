import React, { useEffect, useMemo, useState } from 'react';
import { ArrowLeft, Loader2, XCircle } from 'lucide-react';

const isToday = (dateStr) => {
    const date = new Date(dateStr);
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};

const ViewOrders = ({ messId, onBack }) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await fetch(
                    `https://script.google.com/macros/s/AKfycbxtO5uTnbX6ZUnZzFo8KguDaUnTh8Xfa0w9NbYcySgNJ2RbnI5cLUVENEG_zGPi6kF3rg/exec?mode=getordersbymessid&messId=${messId}`
                );
                const data = await res.json();
                console.log(JSON.stringify(data.orders))
                if (data.success) setOrders(data.orders || []);
                else throw new Error(data.message || 'Failed to load orders.');
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [messId]);

    const todayOrders = useMemo(
        () => orders.filter(order => isToday(order.OrderedAt)),
        [orders]
    );

    const mealSummary = useMemo(() => {
        const meals = { lunch: {}, dinner: {} };

        todayOrders.forEach(order => {
            order.OrderItems.forEach(item => {
                const mealType = item.MealCategory.toLowerCase();
                const name = item.ThaliName;

                if (!meals[mealType][name]) {
                    meals[mealType][name] = {
                        totalQuantity: 0,
                        totalPrice: 0,
                        ordersMap: {},
                        missingPrice: false
                    };
                }

                const orderEntry = meals[mealType][name];

                const unitPrice = item.BasePrice || 0;
                if (!item.BasePrice) {
                    orderEntry.missingPrice = true;
                }

                orderEntry.totalQuantity += item.Quantity;
                orderEntry.totalPrice += item.Quantity * unitPrice;

                if (!orderEntry.ordersMap[order.OrderID]) {
                    orderEntry.ordersMap[order.OrderID] = {
                        quantity: 0,
                        instructions: order.SpecialInstructions?.trim() || ''
                    };
                }

                orderEntry.ordersMap[order.OrderID].quantity += item.Quantity;
            });
        });

        return meals;
    }, [todayOrders]);

    const renderMealSection = (title, mealData, colorClass) => {
        const thalis = Object.entries(mealData);
        if (thalis.length === 0) return null;

        const totalThalis = thalis.reduce((sum, [, data]) => sum + data.totalQuantity, 0);
        const totalPrice = thalis.reduce((sum, [, data]) => sum + data.totalPrice, 0);

        return (
            <div className="bg-white shadow-md rounded-2xl p-5">
                <h2 className={`text-xl font-bold ${colorClass} mb-4`}>{title}</h2>
                <div className="space-y-6">
                    {thalis.map(([thaliName, { totalQuantity, totalPrice, ordersMap, missingPrice }]) => (
                        <div key={thaliName} className="border p-4 rounded-lg">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{thaliName}</h3>
                            <p className="text-sm text-gray-700 mb-1">
                                <strong>Total Quantity:</strong> {totalQuantity}
                            </p>
                            <p className="text-sm text-gray-700 mb-2">
                                <strong>Total Price:</strong> ₹{totalPrice.toFixed(2)}
                            </p>
                            {missingPrice && (
                                <p className="text-xs text-red-600 mt-1">
                                    ⚠ Some thalis have missing prices. Contact TiffIndia.
                                </p>
                            )}
                            <div className="text-sm text-gray-700">
                                <strong>Orders:</strong>
                                <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
                                    {Object.entries(ordersMap).map(([orderId, { quantity, instructions }]) => (
                                        <li key={orderId}>
                                            <span className="font-mono text-orange-600">{orderId}</span>
                                            <span> ({quantity})</span>
                                            {instructions && (
                                                <span className="ml-2 italic text-gray-600">— {instructions}</span>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                    <div className="pt-2 text-right text-base font-semibold text-gray-800">
                        Total Thalis for {title}: <span className="text-green-700">{totalThalis}</span><br />
                        Total {title} Cost: <span className="text-green-700">₹{totalPrice.toFixed(2)}</span>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex justify-center items-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold">Error loading orders</h2>
                <p className="text-gray-600 mb-4">{error}</p>
                <button
                    onClick={() => window.location.reload()}
                    className="px-4 py-2 bg-orange-500 text-white rounded-md"
                >
                    Retry
                </button>
            </div>
        );
    }

    const grandTotal = (
        Object.values(mealSummary.lunch).reduce((sum, thali) => sum + thali.totalPrice, 0) +
        Object.values(mealSummary.dinner).reduce((sum, thali) => sum + thali.totalPrice, 0)
    ).toFixed(2);

    return (
        <div className="max-w-5xl mx-auto p-4 sm:p-6">
            <button
                onClick={onBack}
                className="flex items-center mb-6 text-gray-600 hover:text-orange-500 space-x-2"
            >
                <ArrowLeft />
                <span>Back</span>
            </button>

            <h1 className="text-3xl font-bold text-gray-800 mb-8">Today's Orders Summary</h1>

            {Object.keys(mealSummary.lunch).length === 0 &&
            Object.keys(mealSummary.dinner).length === 0 ? (
                <p className="text-gray-500 text-center">No orders for today.</p>
            ) : (
                <div className="space-y-10">
                    {renderMealSection('Lunch', mealSummary.lunch, 'text-blue-600')}
                    {renderMealSection('Dinner', mealSummary.dinner, 'text-purple-600')}
                </div>
            )}

            <div className="text-right text-lg font-bold text-gray-800 mt-8">
                Grand Total Amount to Pay Mess: ₹{grandTotal}
            </div>
        </div>
    );
};

export default ViewOrders;
