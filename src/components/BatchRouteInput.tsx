
import React, { useState } from 'react';
import { Truck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';

const BatchRouteInput: React.FC = () => {
  const [batchRoute, setBatchRoute] = useState<string>('');
  const { applyBatchRoute, filteredDrivers, selectedRegion, selectedDriver } = useData();

  const handleApplyRoute = () => {
    const routeNumber = parseInt(batchRoute);
    
    if (isNaN(routeNumber) || routeNumber < 0) {
      toast.error('Por favor, insira um número de rota válido.');
      return;
    }

    if (filteredDrivers.length === 0) {
      toast.error('Não há motoristas para aplicar a rota.');
      return;
    }

    applyBatchRoute(routeNumber);
    toast.success(`Rota ${routeNumber} aplicada com sucesso`);
    setBatchRoute('');
  };

  if (!filteredDrivers.length) return null;

  return (
    <div className="glass-card p-4 mb-6 animate-fade-in animate-delay-200">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex items-center gap-2">
          <Truck size={18} className="text-gray-600" />
          <h3 className="text-sm font-medium">Aplicar Rota em Lote:</h3>
        </div>

        <div className="flex flex-1 gap-2">
          <input
            type="number"
            min="0"
            value={batchRoute}
            onChange={(e) => setBatchRoute(e.target.value)}
            placeholder="Número da rota"
            className="flex-1 border border-gray-300 rounded-md p-2 text-sm"
          />
          <button
            onClick={handleApplyRoute}
            className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Aplicar
          </button>
        </div>

        <p className="text-xs text-gray-500 text-center sm:text-left">
          {selectedRegion !== 'all' || selectedDriver !== 'all'
            ? `Aplicar apenas para filtro atual`
            : 'Aplicar para todos os motoristas'}
        </p>
      </div>
    </div>
  );
};

export default BatchRouteInput;
