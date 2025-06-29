import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import UserProfile from '../components/UserProfile';
import { Loader2 } from 'lucide-react';
import MenuEditor from '../components/MenuEditor'; // 1. Import the new component
import ViewOrders from '../components/ViewOrders';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [messData, setmessData] = useState(null);
  const [token] = useState("3e7c711e9c4fdfc83af97b89a20f214e3b4eeb9a1aa6e28245880e05efac582a");

  // 2. Add state to control which view is shown
  const [isEditingMenu, setIsEditingMenu] = useState(false);
  const [isViewMenu, setIsViewMenu] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUserInfo(token);
    }
  }, [token]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`https://script.google.com/macros/s/AKfycbzVXT0nW_pqr90SO4syo728zACiwmd-CyaHngbkM4gigbkgTjkSomR_tnyp8t33qKBXgQ/exec?mode=getmessandmessownerdeatils&&token=${token}`);
      const data = await response.json();
      const messData = data.messes;
      console.log("rr", messData);
      setmessData(messData);
      setLoading(false);
    } catch (error) {
      alert("Failed to fetch user info. Please refresh.");
      setLoading(false);
    }
  };

  // 3. If editing, render the MenuEditor component
  if (isEditingMenu) {
    if (!messData || !messData.messID) return <div>Error loading mess data.</div>;

    return (
      <div className="min-h-screen bg-gray-50">

        <Header messDeatils={messData} />
        <MenuEditor
          messId={messData.messID}
          token={token}
          onBack={() => setIsEditingMenu(false)} // Pass a function to go back
        />
      </div>
    );
  }
  if (isViewMenu) {
    return (
      <div className="min-h-screen bg-gray-50">

        <Header messDeatils={messData} />
        <ViewOrders
          messId={messData.messID}
          token={token}
          onBack={() => setIsViewMenu(false)} // Pass a function to go back
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }
  console.log("rrrrrreeeeeeeeee",messData)
  return (
    <div className="min-h-screen bg-gray-50">
      <Header messDeatils={messData} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <UserProfile messDeatils={messData} />

        {messData && messData.messActive ? (
          <div className="mt-4 flex space-x-4" style={{ justifyContent: 'center' }}>
            <button
              className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-gray-700"
              // 4. Update onClick to change state instead of opening a new tab
              onClick={() => setIsEditingMenu(true)}
            >
              Change Menu
            </button>
            <button
              className="px-4 py-2 bg-green-500 text-white rounded hover:bg-gray-400"
              onClick={() => setIsViewMenu(true)}
            >
              View orders
            </button>
          </div>
        ) : (
          <div className="mt-4 flex space-x-4" style={{ justifyContent: 'center' }}>
            Your Profie is blocked by Tiffindia
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;