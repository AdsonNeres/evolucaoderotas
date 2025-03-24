
import React from 'react';
import { X, BarChart, UserCircle, Map, FileDown, DownloadCloud } from 'lucide-react';
import { useData } from '../context/DataContext';
import { calculateRegionStats, getBackgroundProgressClass } from '../utils/dataUtils';
import { Driver } from '../context/DataContext';
import { toast } from 'sonner';
import DriverEvolution from './DriverEvolution';
import { exportToExcel } from '../utils/excelParser';

const EvolutionView: React.FC = () => {
  const { 
    filteredDrivers, 
    setShowEvolution, 
    evolutionType, 
    setEvolutionType,
    selectedRegion
  } = useData();

  const regionStats = calculateRegionStats(filteredDrivers, selectedRegion !== 'all' ? selectedRegion : undefined);
  const [exportType, setExportType] = React.useState<string>('all');

  const handleExport = () => {
    try {
      exportToExcel(filteredDrivers, exportType);
      toast.success('Relatório exportado com sucesso!');
    } catch (error) {
      console.error('Error exporting data:', error);
      toast.error('Erro ao exportar relatório. Por favor, tente novamente.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="glass-card w-full max-w-5xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white bg-opacity-90 backdrop-blur-sm border-b border-gray-200 flex justify-between items-center p-4">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <BarChart className="text-scanner-header" />
            Evolução de Entregas
          </h2>
          <button
            onClick={() => setShowEvolution(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          {/* View Selection */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex gap-2 items-center">
              <span className="text-sm font-medium text-gray-500">Visualizar:</span>
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setEvolutionType('region')}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                    evolutionType === 'region' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <Map size={14} />
                  Por Região
                </button>
                <button
                  onClick={() => setEvolutionType('driver')}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                    evolutionType === 'driver' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <UserCircle size={14} />
                  Por Motorista
                </button>
                <button
                  onClick={() => setEvolutionType('both')}
                  className={`px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 ${
                    evolutionType === 'both' 
                      ? 'bg-white shadow-sm text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  <BarChart size={14} />
                  Ambos
                </button>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-2">
              <select
                value={exportType}
                onChange={(e) => setExportType(e.target.value)}
                className="border border-gray-300 rounded-md px-3 py-1.5 text-sm bg-white"
              >
                <option value="all">Todos os dados</option>
                <option value="totalOrders">Total de Pedidos</option>
                <option value="delivered">Entregues</option>
                <option value="unsuccessful">Insucessos</option>
              </select>
              <button
                onClick={handleExport}
                className="bg-blue-500 text-white px-4 py-1.5 rounded-md text-sm font-medium flex items-center gap-1"
              >
                <DownloadCloud size={16} />
                Exportar Relatório
              </button>
            </div>
          </div>

          {/* Region Stats */}
          {(evolutionType === 'region' || evolutionType === 'both') && (
            <div className={`glass-card mb-8 ${getBackgroundProgressClass(regionStats.deliveryPercentage)}`}>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">
                  Evolução por Região: {selectedRegion === 'all' ? 'Todas' : selectedRegion}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="glass-card p-4">
                    <p className="text-sm text-gray-500 mb-1">Total de Pedidos</p>
                    <p className="text-2xl font-bold">{regionStats.totalOrders}</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <p className="text-sm text-gray-500 mb-1">Entregues</p>
                    <p className="text-2xl font-bold text-green-600">{regionStats.delivered}</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <p className="text-sm text-gray-500 mb-1">Pendentes</p>
                    <p className="text-2xl font-bold text-amber-600">{regionStats.pending}</p>
                  </div>
                  
                  <div className="glass-card p-4">
                    <p className="text-sm text-gray-500 mb-1">Insucessos</p>
                    <p className="text-2xl font-bold text-red-600">{regionStats.unsuccessful}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-sm font-medium">Progresso de Entregas</span>
                    <span className="text-sm font-medium">{regionStats.deliveryPercentage.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-white bg-opacity-50 rounded-full h-4">
                    <div
                      className={`h-4 rounded-full ${
                        regionStats.deliveryPercentage >= 99
                          ? 'bg-green-500'
                          : regionStats.deliveryPercentage >= 71
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, regionStats.deliveryPercentage)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Driver Evolution */}
          {(evolutionType === 'driver' || evolutionType === 'both') && (
            <DriverEvolution drivers={filteredDrivers} />
          )}
        </div>
      </div>
    </div>
  );
};

export default EvolutionView;
