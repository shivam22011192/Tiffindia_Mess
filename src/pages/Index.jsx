import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import UserProfile from '../components/UserProfile';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [messData, setmessData] = useState(null);
  const [token] = useState("3e7c711e9c4fdfc83af97b89a20f214e3b4eeb9a1aa6e28245880e05efac582a");
  const [deliveryAddressType, setDeliveryAddressType] = useState('home');
  const [selectedMess, setSelectedMess] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  useEffect(() => {
    if (token) {
      fetchUserInfo(token);
    }
  }, [token]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`https://script.google.com/macros/s/AKfycbwGJkHJyDe5OnovzSxvszswA65M_LvmuWf4uZ90hxcW1dxrogp2AHYw2Tto8qvLvSnrSA/exec?mode=getmessandmessownerdeatils&&token=${token}`);
      const data = await response.json();
      const messData = data.messes;
      setmessData(messData);
      setLoading(false);
      // fetchAvailableMesses(messData);
    } catch (error) {
      alert("Failed to fetch user info. Please refresh.");
      setLoading(false);
    }
  };

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
  return (
    <div className="min-h-screen bg-gray-50">
      <Header messDeatils={messData} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <UserProfile
          messDeatils={messData}
        />
      </div>

    </div>
  );
};

export default Index;
