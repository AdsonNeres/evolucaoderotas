
import React from 'react';
import FileUploader from '../components/FileUploader';
import DataTable from '../components/DataTable';
import FilterBar from '../components/FilterBar';
import EvolutionView from '../components/EvolutionView';
import BatchRouteInput from '../components/BatchRouteInput';
import AddDriverForm from '../components/AddDriverForm';
import { DataProvider, useData } from '../context/DataContext';
import { Trash2, FileText } from 'lucide-react';

const Content = () => {
  const { drivers, showEvolution, clearData } = useData();

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <header className="mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 mb-1">
              Agente Serviço Scanner
            </h1>
            <p className="text-gray-600">
              Importe, gerencie e acompanhe a evolução das entregas dos motoristas
            </p>
          </div>
          
          {drivers.length > 0 && (
            <button 
              onClick={clearData}
              className="flex items-center gap-1 px-3 py-1.5 text-red-500 border border-red-200 rounded-md text-sm hover:bg-red-50"
            >
              <Trash2 size={14} />
              Limpar dados
            </button>
          )}
        </div>
      </header>
      
      {drivers.length === 0 ? (
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-6 mb-6 text-center">
            <FileText size={36} className="mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Nenhum dado importado</h2>
            <p className="text-gray-600 mb-6">
              Comece importando um arquivo XLSX com dados dos motoristas e serviços, ou adicione manualmente.
            </p>
          </div>
          <FileUploader />
          <div className="mt-6">
            <AddDriverForm />
          </div>
        </div>
      ) : (
        <>
          <FilterBar />
          <AddDriverForm />
          <BatchRouteInput />
          <DataTable />
          {showEvolution && <EvolutionView />}
        </>
      )}
    </div>
  );
};

const Index = () => {
  return (
    <DataProvider>
      <Content />
    </DataProvider>
  );
};

export default Index;
