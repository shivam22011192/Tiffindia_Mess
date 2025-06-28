// src/components/MenuEditor.js

import React, { useState, useEffect } from 'react';
import { Loader2, ArrowLeft, Edit, XCircle, CheckCircle } from 'lucide-react';

// A helper function to format the date string for display
const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    // No date adjustment is performed here; assuming the source date is correct.
    return date.toLocaleDateString('en-US', options);
};

// A helper function to format the date for the API (YYYY-MM-DD)
const formatDateForApi = (dateString) => {
    const date = new Date(dateString);
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate() + 1).padStart(2, '0');
    console.log("ppppppppppp",`${year}-${month}-${day}`)
    return `${year}-${month}-${day}`;
};

const MenuEditor = ({ messId, token, onBack }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [editingMenuId, setEditingMenuId] = useState(null);
    const [originalMenus, setOriginalMenus] = useState([]);
    // State to track the saving status of a specific menu item
    const [isSaving, setIsSaving] = useState(null);

    useEffect(() => {
        fetchMenus();
    }, [messId, token]);

    const fetchMenus = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://script.google.com/macros/s/AKfycbzTSLGdfpK_G2Z6vefVzYbx5o0heXzTno9xxu69weC1WESivuvWmmJbqEe9X8sDwC5qng/exec?mode=getdailymenuformessowners&&messId=${messId}`);
            const data = await response.json();
            if (data.success) {
                setMenus(data.menus);
                setOriginalMenus(JSON.parse(JSON.stringify(data.menus)));
            } else {
                throw new Error('Failed to fetch menus from API.');
            }
        } catch (err) {
            setError(err.message);
            alert('Failed to load menus. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleMenuContentChange = (index, newContent) => {
        const updatedMenus = [...menus];
        updatedMenus[index].menuContents = newContent;
        setMenus(updatedMenus);
    };

    const handleSaveMenu = async (menuItem) => {
        setIsSaving(menuItem.menuID); // Set saving state for the specific item

        const payload = {
            messID: messId,
            offeringDate: formatDateForApi(menuItem.offeringDate),
            mealType: menuItem.mealType,
            menuContents: menuItem.menuContents,
            status: menuItem.status || "Available", // Add status, defaulting to "Available"
        };

        try {
            const response = await fetch('https://script.google.com/macros/s/AKfycbwQ6YKqKwylaY4bUDskjLHbXM7xw3N26uqdHh52ZZv3Q1a2p74oZDvBbp5cYqJcXAfTWA/exec?mode=updatedailymenucontent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'text/plain;charset=utf-8', // Google Apps Script often expects text/plain
                },
                body: JSON.stringify(payload),
            });

            const result = await response.json();

            if (result.success) {
                alert('Menu updated successfully!');
                setEditingMenuId(null);
                // Update the original data copy to reflect the saved state
                setOriginalMenus(JSON.parse(JSON.stringify(menus)));
            } else {
                throw new Error(result.message || 'An unknown error occurred while saving.');
            }
        } catch (err) {
            alert(`Error: ${err.message}`);
            handleCancelEdit(); // Revert changes on failure
        } finally {
            setIsSaving(null); // Reset saving state
        }
    };

    const handleCancelEdit = () => {
        setMenus(JSON.parse(JSON.stringify(originalMenus)));
        setEditingMenuId(null);
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-center">
                <XCircle className="w-12 h-12 text-red-500 mb-4" />
                <h2 className="text-xl font-semibold text-gray-700 mb-2">Failed to Load Data</h2>
                <p className="text-gray-500 mb-6">{error}</p>
                <button
                    onClick={fetchMenus}
                    className="px-4 py-2 bg-orange-500 text-white font-semibold rounded-md hover:bg-orange-600"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-4 sm:p-6">
            <button onClick={onBack} className="flex items-center space-x-2 text-gray-600 hover:text-orange-500 mb-6">
                <ArrowLeft size={20} />
                <span>Back to Profile</span>
            </button>

            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">Edit Daily Menu</h1>

            <div className="space-y-4">
                {menus.map((menu, index) => {
                    const isEditing = menu.menuID === editingMenuId;
                    const isCurrentlySaving = isSaving === menu.menuID;

                    return (
                        <div key={menu.menuID} className="bg-white p-4 border border-gray-200 rounded-lg shadow-sm">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                                <div className="space-y-1">
                                    <p className="font-bold text-gray-700">{formatDate(menu.offeringDate)}</p>
                                    <p className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${menu.mealType === 'Lunch' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
                                        }`}>{menu.mealType}</p>
                                </div>

                                <div className="md:col-span-2">
                                    <label htmlFor={`menu-${menu.menuID}`} className="block text-sm font-medium text-gray-500 mb-1">Menu Items</label>
                                    {isEditing ? (
                                        <input
                                            id={`menu-${menu.menuID}`}
                                            type="text"
                                            value={menu.menuContents}
                                            onChange={(e) => handleMenuContentChange(index, e.target.value)}
                                            disabled={isCurrentlySaving}
                                            className="w-full p-2 border border-orange-400 rounded-md ring-2 ring-orange-200 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                        />
                                    ) : (
                                        <p className="w-full p-2 text-gray-800">{menu.menuContents}</p>
                                    )}
                                </div>
                            </div>
                            <div className="flex justify-end items-center mt-4 space-x-3">
                                {isEditing ? (
                                    isCurrentlySaving ? (
                                        <button
                                            disabled
                                            className="flex items-center px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md opacity-75 cursor-not-allowed"
                                        >
                                            <Loader2 size={16} className="mr-2 animate-spin" />
                                            Saving...
                                        </button>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 text-sm font-semibold rounded-md hover:bg-gray-300"
                                            >
                                                <XCircle size={16} className="mr-2" />
                                                Cancel
                                            </button>
                                            <button
                                                onClick={() => handleSaveMenu(menu)}
                                                className="flex items-center px-4 py-2 bg-green-500 text-white text-sm font-semibold rounded-md hover:bg-green-600"
                                            >
                                                <CheckCircle size={16} className="mr-2" />
                                                Save
                                            </button>
                                        </>
                                    )
                                ) : (
                                    <button
                                        onClick={() => setEditingMenuId(menu.menuID)}
                                        className="flex items-center px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-md hover:bg-orange-600"
                                    >
                                        <Edit size={16} className="mr-2" />
                                        Edit
                                    </button>
                                )}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default MenuEditor;