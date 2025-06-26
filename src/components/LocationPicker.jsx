import React, { Component } from "react";
import axios from "axios";
import { Button } from "primereact/button";
import debounce from "lodash.debounce";

const GEOCODING_API_KEY = "AIzaSyDmSuzH00t5Bc0ObvVM_NLEN81aZ3m68rM"; // 🔐 Replace with env var in production

class LocationPicker extends Component {
  constructor(props) {
    super(props);
    this.autocompleteInput = React.createRef();
    this.mapDivRef = React.createRef();
    this.autocomplete = null;

    this.state = {
      flatBuilding: props.initialAddressData?.flatBuilding || "",
      areaStreet: props.initialAddressData?.areaStreet || "",
      landmark: props.initialAddressData?.landmark || "",
      city: props.initialAddressData?.city || "",
      pincode: props.initialAddressData?.pincode || "",
      formattedAddress: props.initialAddressData?.formattedAddress || "",
      latitude: props.initialAddressData?.latitude || null,
      longitude: props.initialAddressData?.longitude || null,
      map: null,
      marker: null,
      isGeolocationAvailable: !!navigator.geolocation && !!window.google,
      selectedAddressType: props.addressType || 'home',
    };

    this.fetchAddressFromCoordinates = debounce(this.fetchAddressFromCoordinates, 300);
  }

  componentDidMount() {
    if (this.state.latitude && this.state.longitude) {
      this.initMap();
    } else {
      this.getAndSetCurrentLocation();
    }
  }

  componentDidUpdate(prevProps) {
    const addressChanged = this.props.initialAddressData?.formattedAddress !== prevProps.initialAddressData?.formattedAddress;
    const addressTypeChanged = this.props.addressType !== prevProps.addressType;

    if (addressChanged || addressTypeChanged) {
      const newData = this.props.initialAddressData || {};
      this.setState({
        flatBuilding: newData.flatBuilding || "",
        areaStreet: newData.areaStreet || "",
        landmark: newData.landmark || "",
        city: newData.city || "",
        pincode: newData.pincode || "",
        formattedAddress: newData.formattedAddress || "",
        latitude: newData.latitude || null,
        longitude: newData.longitude || null,
        selectedAddressType: this.props.addressType || 'home',
      }, () => {
        if (this.state.latitude && this.state.longitude) {
          this.initMap();
        } else {
          this.getAndSetCurrentLocation();
        }
      });
    }
  }

  getAndSetCurrentLocation = () => {
    if (navigator.geolocation && window.google) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const lat = pos.coords.latitude;
          const lng = pos.coords.longitude;
          this.setState({ latitude: lat, longitude: lng }, this.initMap);
        },
        err => {
          console.error("Geolocation error:", err);
          alert("Location access denied. Using default location.");
          this.setState({ latitude: 18.5204, longitude: 73.8567 }, this.initMap);
        }
      );
    }
  };

  initMap = () => {
    const { latitude, longitude } = this.state;
    if (!window.google || !this.mapDivRef.current) return;

    const map = new window.google.maps.Map(this.mapDivRef.current, {
      center: { lat: latitude, lng: longitude },
      zoom: 16,
    });

    const marker = new window.google.maps.Marker({
      position: { lat: latitude, lng: longitude },
      map,
      draggable: true,
      animation: window.google.maps.Animation.DROP,
    });

    marker.addListener("dragend", e => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      this.setState({ latitude: newLat, longitude: newLng });
      this.fetchAddressFromCoordinates(newLat, newLng);
    });

    map.addListener("click", e => {
      const newLat = e.latLng.lat();
      const newLng = e.latLng.lng();
      marker.setPosition({ lat: newLat, lng: newLng });
      map.panTo({ lat: newLat, lng: newLng });
      this.setState({ latitude: newLat, longitude: newLng });
      this.fetchAddressFromCoordinates(newLat, newLng);
    });

    this.setState({ map, marker }, () => {
      if (!this.props.initialAddressData?.formattedAddress) {
        this.fetchAddressFromCoordinates(latitude, longitude);
      }
      this.initAutocomplete();
    });
  };

  initAutocomplete = () => {
    const { latitude, longitude } = this.state;
  
    if (!window.google?.maps.places || !this.autocompleteInput.current) return;
  
    if (!this.autocomplete) {
      const options = {
        types: ["address"],
        componentRestrictions: { country: "in" },
        fields: ["address_components", "geometry", "formatted_address"],
        location: new window.google.maps.LatLng(latitude, longitude), // bias to user's location
        radius: 50000 // 50 km radius
      };
  
      this.autocomplete = new window.google.maps.places.Autocomplete(this.autocompleteInput.current, options);
  
      // Set bounds bias
      const circle = new window.google.maps.Circle({
        center: { lat: latitude, lng: longitude },
        radius: 50000 // 50 km
      });
      this.autocomplete.setBounds(circle.getBounds());
  
      this.autocomplete.addListener("place_changed", this.onPlaceChanged);
    }
  };

  onPlaceChanged = () => {
    const place = this.autocomplete.getPlace();
    if (!place.geometry) return;

    let flatBuilding = "", areaStreet = "", landmark = "", city = "", pincode = "";
    const formattedAddress = place.formatted_address || "";

    for (const component of place.address_components) {
      const type = component.types[0];
      switch (type) {
        case "street_number":
        case "route":
          areaStreet += " " + component.long_name;
          break;
        case "sublocality":
        case "locality":
        case "political":
          areaStreet += areaStreet ? ", " + component.long_name : component.long_name;
          if (!city) city = component.long_name;
          break;
        case "postal_code":
          pincode = component.long_name;
          break;
        case "premise":
        case "subpremise":
          flatBuilding += (flatBuilding ? ", " : "") + component.long_name;
          break;
      }
    }

    this.setState({
      flatBuilding: flatBuilding.trim(),
      areaStreet: areaStreet.trim(),
      city: city.trim(),
      pincode: pincode.trim(),
      formattedAddress,
      latitude: place.geometry.location.lat(),
      longitude: place.geometry.location.lng(),
    }, () => {
      const { map, marker, latitude, longitude } = this.state;
      if (map && marker) {
        marker.setPosition({ lat: latitude, lng: longitude });
        map.panTo({ lat: latitude, lng: longitude });
      }
    });
  };

  fetchAddressFromCoordinates = async (lat, lng) => {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GEOCODING_API_KEY}`;
    try {
      const res = await axios.get(url);
      const result = res.data.results[0];
      if (result) {
        let flatBuilding = "", areaStreet = "", city = "", pincode = "";
        const formattedAddress = result.formatted_address;

        for (const comp of result.address_components) {
          const type = comp.types[0];
          switch (type) {
            case "street_number":
            case "route":
              areaStreet += " " + comp.long_name;
              break;
            case "sublocality":
            case "locality":
            case "political":
              areaStreet += areaStreet ? ", " + comp.long_name : comp.long_name;
              if (!city) city = comp.long_name;
              break;
            case "postal_code":
              pincode = comp.long_name;
              break;
            case "premise":
            case "subpremise":
              flatBuilding += (flatBuilding ? ", " : "") + comp.long_name;
              break;
          }
        }

        this.setState({
          flatBuilding: flatBuilding.trim(),
          areaStreet: areaStreet.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          formattedAddress,
        });
      }
    } catch (err) {
      console.error("Reverse geocoding failed", err);
    }
  };

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleAddressTypeChange = e => {
    this.setState({ selectedAddressType: e.target.value });
  };

  handleSave = async () => {
    const { token, onAddressSaved } = this.props;
    const { selectedAddressType, flatBuilding, areaStreet, landmark, city, pincode, latitude, longitude, formattedAddress } = this.state;

    if (!token || !selectedAddressType || !formattedAddress || !latitude || !longitude || !areaStreet || !city || !pincode) {
      alert("Please complete all required address fields.");
      return;
    }

    try {
      await axios.post("https://script.google.com/macros/s/AKfycbzmIXeMo5axlmY4jgG5y10DvWa8TQHvo74LrOuOgScDOb9UqXYYms7t7MrT6vFyIvYN/exec?mode=updateaddress", JSON.stringify({
        token,
        addressType: selectedAddressType,
        flatBuilding,
        areaStreet,
        landmark,
        city,
        pincode,
        latitude,
        longitude,
        formattedAddress,
      }));
      alert(`✅ ${selectedAddressType.charAt(0).toUpperCase() + selectedAddressType.slice(1)} address saved!`);
      if (onAddressSaved) onAddressSaved();
    } catch (err) {
      console.error("Failed to save address", err);
      alert("Failed to save address. Please try again.");
    }
  };

  render() {
    const { flatBuilding, areaStreet, landmark, city, pincode, formattedAddress, isGeolocationAvailable, selectedAddressType } = this.state;
    const addressTypes = ['home', 'office', 'other'];

    return (
      <div style={{ padding: 20, maxWidth: 600, margin: "auto", border: "1px solid #ddd", borderRadius: 8 }}>
        {(
          <Button icon="pi pi-caret-left" onClick={this.props.onBack} className="p-button-text" />
        )}
        <h2 style={{ textAlign: "center" }}>📍 Save Your Delivery Location</h2>

        <div style={{ textAlign: "center", marginBottom: 15 }}>
          <label>Select Address Type:</label><br />
          {addressTypes.map(type => (
            <label key={type} style={{ marginRight: 20 }}>
              <input
                type="radio"
                value={type}
                checked={selectedAddressType === type}
                onChange={this.handleAddressTypeChange}
                style={{ marginRight: 5 }}
              />
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </label>
          ))}
        </div>

        <div style={{ marginBottom: 10 }}>
          <strong>Full Address:</strong>
          <p>{formattedAddress || "Locating..."}</p>
        </div>

        {isGeolocationAvailable && (
          <Button label="📍 Detect Current Location" onClick={this.getAndSetCurrentLocation} style={{ width: "100%", marginBottom: 15 }} />
        )}

        <input
          ref={this.autocompleteInput}
          name="areaStreet"
          value={areaStreet}
          onChange={this.handleChange}
          placeholder="Area / Street / Locality"
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          name="flatBuilding"
          value={flatBuilding}
          onChange={this.handleChange}
          placeholder="Flat / Building"
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          name="landmark"
          value={landmark}
          onChange={this.handleChange}
          placeholder="Landmark (optional)"
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          name="city"
          value={city}
          onChange={this.handleChange}
          placeholder="City"
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <input
          name="pincode"
          value={pincode}
          onChange={this.handleChange}
          placeholder="Pincode"
          style={{ width: "100%", padding: 10, marginBottom: 10 }}
        />

        <div ref={this.mapDivRef} style={{ width: "100%", height: 300, marginBottom: 20 }} />

        <Button label="💾 Save Address" onClick={this.handleSave} style={{ width: "100%" }} />
      </div>
    );
  }
}

export default LocationPicker;
