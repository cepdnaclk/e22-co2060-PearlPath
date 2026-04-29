import React, { createContext, useState, useEffect } from 'react';

export const VehicleContext = createContext();

export const VehicleProvider = ({ children }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(() => {
    // Optional: Load from local storage on initialization
    const saved = localStorage.getItem('selectedVehicle');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  useEffect(() => {
    // Save to local storage whenever it changes
    if (selectedVehicle) {
      localStorage.setItem('selectedVehicle', JSON.stringify(selectedVehicle));
    } else {
      localStorage.removeItem('selectedVehicle');
    }
  }, [selectedVehicle]);

  return (
    <VehicleContext.Provider value={{ selectedVehicle, setSelectedVehicle }}>
      {children}
    </VehicleContext.Provider>
  );
};
