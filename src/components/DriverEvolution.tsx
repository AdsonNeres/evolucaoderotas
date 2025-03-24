
import React, { useState } from 'react';
import { ArrowDown, ArrowUp, User, Route } from 'lucide-react';
import { Driver } from '../context/DataContext';
import { getBackgroundProgressClass } from '../utils/dataUtils';

interface DriverEvolutionProps {
  drivers: Driver[];
}

const DriverEvolution: React.FC<DriverEvolutionProps> = ({ drivers }) => {
  const [sortBy, setSortBy] = useState<keyof Driver>('deliveryPercentage');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  const handleSort = (key: keyof Driver) => {
    if (sortBy === key) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(key);
      setSortDirection('desc');
    }
  };

  const sortedDrivers = [...drivers].sort((a, b) => {
    const valueA = a[sortBy];
    const valueB = b[sortBy];

    if (typeof valueA === 'number' && typeof valueB === 'number') {
      return sortDirection === 'asc' ? valueA - valueB : valueB - valueA;
    }

    // Fall back to string comparison
    const strA = String(valueA).toLowerCase();
    const strB = String(valueB).toLowerCase();
    
    return sortDirection === 'asc' 
      ? strA.localeCompare(strB) 
      : strB.localeCompare(strA);
  });

  const getSortIcon = (key: keyof Driver) => {
    if (sortBy !== key) return null;
    return sortDirection === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  return (
    <div className="glass-card">
      <div className="p-6">
        <h3 className="text-lg font-semibold mb-4">Evolução por Motorista</h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-100 text-gray-600">
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    <User size={14} />
                    Motorista
                    {getSortIcon('name')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('region')}
                >
                  <div className="flex items-center gap-1">
                    Região
                    {getSortIcon('region')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('route')}
                >
                  <div className="flex items-center gap-1">
                    <Route size={14} />
                    Rota
                    {getSortIcon('route')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('totalOrders')}
                >
                  <div className="flex items-center gap-1">
                    Total Pedidos
                    {getSortIcon('totalOrders')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('delivered')}
                >
                  <div className="flex items-center gap-1">
                    Entregues
                    {getSortIcon('delivered')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('unsuccessful')}
                >
                  <div className="flex items-center gap-1">
                    Insucessos
                    {getSortIcon('unsuccessful')}
                  </div>
                </th>
                <th 
                  className="py-3 px-4 text-left cursor-pointer hover:bg-gray-200"
                  onClick={() => handleSort('deliveryPercentage')}
                >
                  <div className="flex items-center gap-1">
                    % de Entregas
                    {getSortIcon('deliveryPercentage')}
                  </div>
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDrivers.map((driver) => (
                <tr key={driver.id} className={`border-t border-gray-200 ${getBackgroundProgressClass(driver.deliveryPercentage)}`}>
                  <td className="py-3 px-4 font-medium">{driver.name}</td>
                  <td className="py-3 px-4">{driver.region}</td>
                  <td className="py-3 px-4">{driver.route || '-'}</td>
                  <td className="py-3 px-4">{driver.totalOrders}</td>
                  <td className="py-3 px-4">{driver.delivered}</td>
                  <td className="py-3 px-4">{driver.unsuccessful}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[100px] bg-white bg-opacity-50 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${
                            driver.deliveryPercentage >= 99
                              ? 'bg-green-500'
                              : driver.deliveryPercentage >= 71
                              ? 'bg-yellow-500'
                              : 'bg-red-500'
                          }`}
                          style={{ width: `${Math.min(100, driver.deliveryPercentage)}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium">{driver.deliveryPercentage.toFixed(1)}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DriverEvolution;
