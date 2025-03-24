
import React from 'react';
import { useData, Driver } from '../context/DataContext';
import { getProgressBarColorClass } from '../utils/dataUtils';
import { BarChart3 } from 'lucide-react';
import { toast } from 'sonner';

const DataTable: React.FC = () => {
  const { filteredDrivers, updateDriver, setShowEvolution } = useData();

  const handleDeliveredChange = (id: string, value: string) => {
    const delivered = parseInt(value) || 0;
    const driver = filteredDrivers.find(d => d.id === id);
    
    if (!driver) return;
    
    if (delivered > driver.totalOrders) {
      toast.error('O número de entregas não pode ser maior que o total de pedidos.');
      return;
    }
    
    updateDriver(id, { delivered });
  };

  const handleUnsuccessfulChange = (id: string, value: string) => {
    const unsuccessful = parseInt(value) || 0;
    const driver = filteredDrivers.find(d => d.id === id);
    
    if (!driver) return;
    
    if (unsuccessful > driver.totalOrders) {
      toast.error('O número de insucessos não pode ser maior que o total de pedidos.');
      return;
    }
    
    updateDriver(id, { unsuccessful });
  };

  const handleRouteChange = (id: string, value: string) => {
    const route = parseInt(value) || 0;
    
    if (route < 0) {
      toast.error('O número da rota não pode ser negativo.');
      return;
    }
    
    updateDriver(id, { route });
  };

  const handleGenerateEvolution = () => {
    if (filteredDrivers.some(driver => driver.delivered === 0)) {
      toast.warning('Alguns motoristas não possuem entregas registradas.');
    }
    
    setShowEvolution(true);
  };

  if (filteredDrivers.length === 0) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in">
        <p className="text-gray-500">Nenhum motorista encontrado. Importe um arquivo XLSX ou ajuste os filtros.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in animate-delay-300">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleGenerateEvolution}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-md font-medium"
        >
          <BarChart3 size={16} />
          Gerar Evolução
        </button>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-scanner-header text-white">
                <th className="py-3 px-4 text-left">Data</th>
                <th className="py-3 px-4 text-left">Motorista</th>
                <th className="py-3 px-4 text-left">Rota</th>
                <th className="py-3 px-4 text-left">Total Pedidos</th>
                <th className="py-3 px-4 text-left">Entregues</th>
                <th className="py-3 px-4 text-left">Pendentes</th>
                <th className="py-3 px-4 text-left">Insucessos</th>
                <th className="py-3 px-4 text-left">% Entregas</th>
              </tr>
            </thead>
            <tbody>
              {filteredDrivers.map((driver, index) => (
                <tr key={driver.id} className={`alternate-row`}>
                  <td className="py-3 px-4">
                    {new Date(driver.date).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="py-3 px-4 font-medium">{driver.name}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      value={driver.route || ''}
                      onChange={(e) => handleRouteChange(driver.id, e.target.value)}
                      className="w-16 border border-gray-300 rounded p-1 text-sm"
                    />
                  </td>
                  <td className="py-3 px-4">{driver.totalOrders}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      max={driver.totalOrders}
                      value={driver.delivered || ''}
                      onChange={(e) => handleDeliveredChange(driver.id, e.target.value)}
                      className="w-16 border border-gray-300 rounded p-1 text-sm"
                    />
                  </td>
                  <td className="py-3 px-4">{driver.pending}</td>
                  <td className="py-3 px-4">
                    <input
                      type="number"
                      min="0"
                      max={driver.totalOrders}
                      value={driver.unsuccessful || ''}
                      onChange={(e) => handleUnsuccessfulChange(driver.id, e.target.value)}
                      className="w-16 border border-gray-300 rounded p-1 text-sm"
                    />
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-full max-w-[100px] bg-gray-200 rounded-full h-2.5">
                        <div
                          className={`h-2.5 rounded-full ${getProgressBarColorClass(driver.deliveryPercentage)}`}
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

export default DataTable;
