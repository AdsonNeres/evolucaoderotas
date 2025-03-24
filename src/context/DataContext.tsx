
import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Driver {
  id: string;
  date: string;
  name: string;
  vehicle: string;
  region: string;
  totalOrders: number;
  delivered: number;
  pending: number;
  unsuccessful: number;
  route: number;
  deliveryPercentage: number;
}

interface DataContextType {
  drivers: Driver[];
  setDrivers: React.Dispatch<React.SetStateAction<Driver[]>>;
  filteredDrivers: Driver[];
  selectedRegion: string;
  setSelectedRegion: React.Dispatch<React.SetStateAction<string>>;
  selectedDate: string;
  setSelectedDate: React.Dispatch<React.SetStateAction<string>>;
  selectedDriver: string;
  setSelectedDriver: React.Dispatch<React.SetStateAction<string>>;
  showEvolution: boolean;
  setShowEvolution: React.Dispatch<React.SetStateAction<boolean>>;
  evolutionType: 'region' | 'driver' | 'both';
  setEvolutionType: React.Dispatch<React.SetStateAction<'region' | 'driver' | 'both'>>;
  clearData: () => void;
  updateDriver: (id: string, data: Partial<Driver>) => void;
  applyBatchRoute: (route: number) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const today = new Date().toISOString().split('T')[0];
  const [drivers, setDrivers] = useState<Driver[]>(() => {
    const saved = localStorage.getItem('scannerDrivers');
    return saved ? JSON.parse(saved) : [];
  });
  const [selectedRegion, setSelectedRegion] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<string>(today);
  const [selectedDriver, setSelectedDriver] = useState<string>('all');
  const [showEvolution, setShowEvolution] = useState<boolean>(false);
  const [evolutionType, setEvolutionType] = useState<'region' | 'driver' | 'both'>('both');

  // Update localStorage when drivers change
  useEffect(() => {
    localStorage.setItem('scannerDrivers', JSON.stringify(drivers));
  }, [drivers]);

  // Filter drivers based on selected filters
  const filteredDrivers = drivers.filter((driver) => {
    const regionMatch = selectedRegion === 'all' || driver.region === selectedRegion;
    const dateMatch = !selectedDate || driver.date === selectedDate;
    const driverMatch = selectedDriver === 'all' || driver.id === selectedDriver;
    return regionMatch && dateMatch && driverMatch;
  });

  // Update a specific driver
  const updateDriver = (id: string, data: Partial<Driver>) => {
    setDrivers((prev) =>
      prev.map((driver) => {
        if (driver.id === id) {
          const updatedDriver = { ...driver, ...data };
          
          // Recalculate delivery percentage if relevant fields were updated
          if ('delivered' in data || 'totalOrders' in data) {
            const delivered = 'delivered' in data ? data.delivered! : driver.delivered;
            const totalOrders = 'totalOrders' in data ? data.totalOrders! : driver.totalOrders;
            updatedDriver.deliveryPercentage = totalOrders > 0 ? (delivered / totalOrders) * 100 : 0;
          }
          
          // Update pending count
          if ('delivered' in data || 'totalOrders' in data || 'unsuccessful' in data) {
            const delivered = 'delivered' in data ? data.delivered! : driver.delivered;
            const totalOrders = 'totalOrders' in data ? data.totalOrders! : driver.totalOrders;
            const unsuccessful = 'unsuccessful' in data ? data.unsuccessful! : driver.unsuccessful;
            updatedDriver.pending = totalOrders - delivered;
          }
          
          return updatedDriver;
        }
        return driver;
      })
    );
  };

  // Apply route to all filtered drivers
  const applyBatchRoute = (route: number) => {
    if (route < 0) return;
    
    setDrivers((prev) =>
      prev.map((driver) => {
        if (
          (selectedRegion === 'all' || driver.region === selectedRegion) &&
          (selectedDriver === 'all' || driver.id === selectedDriver)
        ) {
          return { ...driver, route };
        }
        return driver;
      })
    );
  };

  // Clear all data
  const clearData = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      setDrivers([]);
      localStorage.removeItem('scannerDrivers');
    }
  };

  return (
    <DataContext.Provider
      value={{
        drivers,
        setDrivers,
        filteredDrivers,
        selectedRegion,
        setSelectedRegion,
        selectedDate,
        setSelectedDate,
        selectedDriver,
        setSelectedDriver,
        showEvolution,
        setShowEvolution,
        evolutionType,
        setEvolutionType,
        clearData,
        updateDriver,
        applyBatchRoute,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
