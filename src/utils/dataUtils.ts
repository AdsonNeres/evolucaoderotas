
import { Driver } from '../context/DataContext';

export const calculateRegionStats = (
  drivers: Driver[],
  region: string = 'all'
) => {
  const filteredDrivers = region === 'all' 
    ? drivers 
    : drivers.filter(driver => driver.region === region);

  if (filteredDrivers.length === 0) {
    return {
      totalOrders: 0,
      delivered: 0,
      pending: 0,
      unsuccessful: 0,
      deliveryPercentage: 0,
    };
  }

  const totalOrders = filteredDrivers.reduce((sum, driver) => sum + driver.totalOrders, 0);
  const delivered = filteredDrivers.reduce((sum, driver) => sum + driver.delivered, 0);
  const unsuccessful = filteredDrivers.reduce((sum, driver) => sum + driver.unsuccessful, 0);
  const pending = totalOrders - delivered;
  const deliveryPercentage = totalOrders > 0 ? (delivered / totalOrders) * 100 : 0;

  return {
    totalOrders,
    delivered,
    pending,
    unsuccessful,
    deliveryPercentage,
  };
};

export const getProgressColorClass = (percentage: number) => {
  if (percentage >= 99) return 'bg-scanner-success text-white';
  if (percentage >= 71) return 'bg-scanner-warning text-black';
  return 'bg-scanner-danger text-white';
};

export const getProgressBarColorClass = (percentage: number) => {
  if (percentage >= 99) return 'bg-green-500';
  if (percentage >= 71) return 'bg-yellow-500';
  return 'bg-red-500';
};

export const getBackgroundProgressClass = (percentage: number) => {
  if (percentage >= 99) return 'bg-progress-good';
  if (percentage >= 71) return 'bg-progress-warning';
  return 'bg-progress-bad';
};

export const getUniqueDrivers = (drivers: Driver[], region: string = 'all') => {
  const filteredDrivers = region === 'all' 
    ? drivers 
    : drivers.filter(driver => driver.region === region);
  
  // Get unique driver ids with their names
  const uniqueDrivers = Array.from(
    new Map(
      filteredDrivers.map(driver => [
        driver.id,
        { id: driver.id, name: driver.name }
      ])
    ).values()
  );
  
  return uniqueDrivers;
};

export const getUniqueDates = (drivers: Driver[]) => {
  const uniqueDates = Array.from(new Set(drivers.map(driver => driver.date)));
  return uniqueDates.sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
};
