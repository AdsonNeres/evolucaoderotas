
import React, { useEffect } from 'react';
import { Filter, Calendar, User, MapPin } from 'lucide-react';
import { useData } from '../context/DataContext';
import { getUniqueDates, getUniqueDrivers } from '../utils/dataUtils';

const FilterBar: React.FC = () => {
  const {
    drivers,
    selectedRegion,
    setSelectedRegion,
    selectedDate,
    setSelectedDate,
    selectedDriver,
    setSelectedDriver,
  } = useData();

  const availableDates = getUniqueDates(drivers);
  const availableDrivers = getUniqueDrivers(drivers, selectedRegion);

  // Reset driver selection when region changes
  useEffect(() => {
    if (selectedRegion !== 'all') {
      const driverExists = availableDrivers.some(d => d.id === selectedDriver);
      if (!driverExists) {
        setSelectedDriver('all');
      }
    }
  }, [selectedRegion, availableDrivers, selectedDriver, setSelectedDriver]);

  if (drivers.length === 0) return null;

  return (
    <div className="glass-card p-4 mb-6 animate-fade-in animate-delay-100">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={18} className="text-gray-500" />
          <h3 className="text-sm font-medium">Filtros:</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full">
          {/* Date filter */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1 text-sm text-gray-600">
              <Calendar size={16} />
              Data
            </label>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm bg-white"
            >
              <option value="">Todas as datas</option>
              {availableDates.map((date) => (
                <option key={date} value={date}>
                  {new Date(date).toLocaleDateString('pt-BR')}
                </option>
              ))}
            </select>
          </div>

          {/* Region filter */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1 text-sm text-gray-600">
              <MapPin size={16} />
              Região
            </label>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm bg-white"
            >
              <option value="all">Todas</option>
              <option value="SP">São Paulo (SP)</option>
              <option value="RJ">Rio de Janeiro (RJ)</option>
            </select>
          </div>

          {/* Driver filter */}
          <div className="flex flex-col gap-1">
            <label className="flex items-center gap-1 text-sm text-gray-600">
              <User size={16} />
              Motorista
            </label>
            <select
              value={selectedDriver}
              onChange={(e) => setSelectedDriver(e.target.value)}
              className="border border-gray-300 rounded-md p-2 text-sm bg-white"
            >
              <option value="all">Todos</option>
              {availableDrivers.map((driver) => (
                <option key={driver.id} value={driver.id}>
                  {driver.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
