import React, { useState, useEffect } from 'react';
import Header from '../components/Header';
import LocationPicker from '../components/LocationPicker';
import UserProfile from '../components/UserProfile';
import MessList from '../components/MessList';
import MessDetails from '../components/MessDetails';
import Cart from '../components/Cart';
import Checkout from '../components/Checkout';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [token] = useState("f9bfffd8d98ed92bb1ec871a5019c24d5a9576e134f10b4f15169ef85b7c4f4c");
  const [addressRequired, setAddressRequired] = useState(false);
  const [selectedAddressType, setSelectedAddressType] = useState(null);
  const [deliveryAddressType, setDeliveryAddressType] = useState('home');
  const [availableMesses, setAvailableMesses] = useState([]);
  const [messesLoading, setMessesLoading] = useState(false);
  const [selectedMess, setSelectedMess] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);

  useEffect(() => {
    if (token) {
      fetchUserInfo(token);
    }
  }, [token]);

  const fetchUserInfo = async (token) => {
    try {
      const response = await fetch(`https://script.google.com/macros/s/AKfycbz6KIFBhc0eH3ZvuQvQqooGuLT_WCWfhf7xhD0evOUX7LKE5-Rr23SSGJb-aX6Ug3RmrQ/exec?token=${token}`);
      const data = await response.json();
      const userData = data.user;

      const hasHomeAddress = userData?.homeAddress?.formattedAddress;
      const hasOfficeAddress = userData?.officeAddress?.formattedAddress;
      const hasOtherAddress = userData?.otherAddress?.formattedAddress;

      const isAddressRequired = !hasHomeAddress && !hasOfficeAddress && !hasOtherAddress;

      let currentDeliveryType = deliveryAddressType;
      if (isAddressRequired) {
        currentDeliveryType = 'home';
      } else if (!userData?.[`${deliveryAddressType}Address`]?.formattedAddress) {
        if (hasHomeAddress) currentDeliveryType = 'home';
        else if (hasOfficeAddress) currentDeliveryType = 'office';
        else if (hasOtherAddress) currentDeliveryType = 'other';
      }

      setUser(userData);
      setAddressRequired(isAddressRequired);
      setSelectedAddressType(isAddressRequired ? currentDeliveryType : null);
      setDeliveryAddressType(currentDeliveryType);
      setLoading(false);

      if (!isAddressRequired && currentDeliveryType) {
        fetchAvailableMesses(userData, currentDeliveryType);
      }
    } catch (error) {
      alert("Failed to fetch user info. Please refresh.");
      setLoading(false);
    }
  };

  const fetchAvailableMesses = async (userData, addressType) => {
    const deliveryAddress = userData?.[`${addressType}Address`];

    if (!deliveryAddress || !deliveryAddress.pincode) {
      console.warn("No valid delivery address or pincode to fetch messes.");
      setAvailableMesses([]);
      return;
    }

    setMessesLoading(true);
    setAvailableMesses([]);

    try {
      const response = await fetch(`https://script.google.com/macros/s/AKfycbz6KIFBhc0eH3ZvuQvQqooGuLT_WCWfhf7xhD0evOUX7LKE5-Rr23SSGJb-aX6Ug3RmrQ/exec?mode=getmesses&pincode=${deliveryAddress.pincode}`);
      const data = await response.json();
      
      // Process the messes to filter thalis properly
      const processedMesses = (data.messes || []).map(mess => ({
        ...mess,
        thalis: mess.thalis ? mess.thalis.filter(thali => thali.messID === mess.messID) : []
      }));
      
      setAvailableMesses(processedMesses);
    } catch (error) {
      alert("Failed to fetch messes for your area. Please try again.");
      setAvailableMesses([]);
    } finally {
      setMessesLoading(false);
    }
  };

  const handleAddressSaved = () => {
    setSelectedAddressType(null);
    if (token) {
      fetchUserInfo(token);
    }
  };

  const handleDeliveryAddressChange = (newAddressType) => {
    if (user?.[`${newAddressType}Address`]) {
      setDeliveryAddressType(newAddressType);
      fetchAvailableMesses(user, newAddressType);
    } else {
      setSelectedAddressType(newAddressType);
    }
  };

  const addToCart = (thali, quantity) => {
    if (!selectedMess) return;


    if (cartItems.length > 0 && cartItems[0].messID !== selectedMess.messID) {
      alert(`You can only order from one mess at a time. Please clear your cart to order from ${selectedMess.messName}.`);
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.messThaliID === thali.messThaliID && item.messID === selectedMess.messID);
      if (existing) {
        return prev.map(item =>
          item.messThaliID === thali.messThaliID && item.messID === selectedMess.messID
            ? { ...item, quantity }
            : item
        );
      }
      return [...prev, { ...thali, messID: selectedMess.messID, quantity }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems(prev => prev.filter(item => item.messThaliID !== itemId));
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity === 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems(prev =>
      prev.map(item =>
        item.messThaliID === itemId ? { ...item, quantity } : item
      )
    );
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.sellingPrice * item.quantity), 0);
  };

  const clearCart = () => {
    setCartItems([]);
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
  const currentDeliveryAddress = user?.[`${deliveryAddressType}Address`];
  if (selectedAddressType) {
    const initialAddressData = user?.[`${selectedAddressType}Address`] || {};
    return (
      <LocationPicker
        token={token}
        addressType={selectedAddressType}
        initialAddressData={initialAddressData}
        onAddressSaved={handleAddressSaved}
        onBack={() => { setSelectedAddressType(null) }
        }
      />
    );
  }

  if (showCheckout) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={getTotalItems()} onCartClick={() => setShowCart(true)} shortAddress={`${currentDeliveryAddress.areaStreet.slice(0, 5)}, ${currentDeliveryAddress.city}-${currentDeliveryAddress.pincode}`} />
        <Checkout
          cartItems={cartItems.map(item => ({
            id: item.messThaliID,
            messID : item.messID,
            name: item.thaliName,
            price: item.sellingPrice,
            quantity: item.quantity,
            messName: selectedMess?.messName || ''
          }))}
          availableMesses = {availableMesses}
          currentDeliveryAddress = {currentDeliveryAddress}
          selectedMess = {selectedMess}
          total={getTotalPrice()}
          onBack={() => setShowCheckout(false)}
        />
      </div>
    );
  }

  if (selectedMess) {
    // Filter cart items to only show items from the current mess
    const currentMessCartItems = cartItems.filter(item => item.messID === selectedMess.messID);
    return (
      <div className="min-h-screen bg-gray-50">
        <Header cartCount={getTotalItems()} onCartClick={() => setShowCart(true)} shortAddress={`${currentDeliveryAddress.areaStreet.slice(0, 10)}, ${currentDeliveryAddress.city}-${currentDeliveryAddress.pincode}`} />
        <MessDetails
          mess={{
            id: selectedMess.messID,
            name: selectedMess.messName,
            rating: selectedMess.averageRating || 4.5,
            reviews: 120,
            daily_Menus: selectedMess.Daily_Menus,
            distance: "0.5 km",
            deliveryTime: "25-30 min",
            cuisine: selectedMess.messType,
            price: "₹150-300",
            image: selectedMess.imageUrl || "/placeholder.svg",
            specialties: [selectedMess.messType],
            isOpen: true,
            thalis: selectedMess.thalis?.map(thali => ({
              id: thali.messThaliID,
              name: thali.thaliName,
              price: thali.sellingPrice,
              description: thali.thaliContents,
              image: "/placeholder.svg",
              isVeg: true,
              popular: thali.mealCategory === "lunch"
            })) || []
          }}
          onBack={() => setSelectedMess(null)}
          onAddToCart={(item) => {
            const thali = selectedMess.thalis?.find(t => t.messThaliID === item.id);
            if (thali) {
              addToCart(thali, 1);
            }
          }}
          checkOut = {() => setShowCheckout(true)}
          cartItems={currentMessCartItems}
          onUpdateQuantity={(itemId, quantity) => updateQuantity(itemId, quantity)}
          onClearCart={clearCart}
        />
        {showCart && (
          <Cart
            items={currentMessCartItems.map(item => ({
              id: item.messThaliID,
              name: item.thaliName,
              price: item.sellingPrice,
              quantity: item.quantity,
              messName: selectedMess.messName,
              image: "/placeholder.svg"
            }))}
            onClose={() => setShowCart(false)}
            onRemove={(itemId) => removeFromCart(itemId)}
            onUpdateQuantity={updateQuantity}
            onCheckout={() => {
              setShowCart(false);
              setShowCheckout(true);
            }}
            total={getTotalPrice()}
          />
        )}
      </div>
    );
  }

  const availableAddressTypes = ['home', 'office', 'other'].filter(type =>
    user?.[`${type}Address`]?.formattedAddress
  );
  return (
    <div className="min-h-screen bg-gray-50">
      <Header cartCount={getTotalItems()} onCartClick={() => setShowCart(true)} shortAddress={`${currentDeliveryAddress.areaStreet.slice(0, 10)}, ${currentDeliveryAddress.city}-${currentDeliveryAddress.pincode}`} />

      <div className="max-w-7xl mx-auto px-4 py-6">
        <UserProfile
          user={user}
          currentAddress={currentDeliveryAddress}
          deliveryAddressType={deliveryAddressType}
          availableAddressTypes={availableAddressTypes}
          onDeliveryAddressChange={handleDeliveryAddressChange}
          onEditAddress={() => setSelectedAddressType(deliveryAddressType)}
        />

        <div className="mt-6">
          {messesLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="flex flex-col items-center space-y-4">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                <p>Searching messes near you...</p>
              </div>
            </div>
          ) : availableMesses.length > 0 ? (
            <MessList
              messes={availableMesses.map(mess => ({
                id: mess.messID,
                name: mess.messName,
                rating: mess.averageRating || 4.5,
                reviews: 120,
                distance: "0.5 km",
                deliveryTime: "25-30 min",
                cuisine: mess.messType,
                daily_Menus : mess.Daily_Menus.menuContents,
                price: "₹150-300",
                image: mess.imageUrl || "/placeholder.svg",
                specialties: [mess.messType, "Fresh Food", "Homestyle"],
                isOpen: true,
                description: mess.messDescription
              }))}
              onSelectMess={(mess) => {
                const selectedMessData = availableMesses.find(m => m.messID === mess.id);
                if (selectedMessData) {
                  setSelectedMess(selectedMessData);
                }
              }}
            />
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">
                No messes found delivering to {currentDeliveryAddress?.pincode || 'your selected address'}.
                Try a different address or check back later.
              </p>
            </div>
          )}
        </div>
      </div>

      {showCart && (
        <Cart
          items={cartItems.map(item => ({
            id: item.messThaliID,
            name: item.thaliName,
            price: item.sellingPrice,
            quantity: item.quantity,
            messName: selectedMess?.messName || '',
            image: "/placeholder.svg"
          }))}
          onClose={() => setShowCart(false)}
          onRemove={(itemId) => removeFromCart(itemId)}
          onUpdateQuantity={updateQuantity}
          onCheckout={() => {
            setShowCart(false);
            setShowCheckout(true);
          }}
          total={getTotalPrice()}
        />
      )}
    </div>
  );
};

export default Index;
