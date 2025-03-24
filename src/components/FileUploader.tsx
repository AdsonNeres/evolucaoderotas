
import React, { useState } from 'react';
import { Upload, FileWarning, CheckCircle } from 'lucide-react';
import { parseExcelFile } from '../utils/excelParser';
import { useData } from '../context/DataContext';
import { toast } from 'sonner';

const FileUploader: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { setDrivers } = useData();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.xlsx')) {
      toast.error('Por favor, selecione um arquivo XLSX válido.');
      return;
    }

    setIsLoading(true);
    
    try {
      const drivers = await parseExcelFile(file);
      
      if (drivers.length === 0) {
        toast.error('Nenhum motorista encontrado no arquivo. Verifique se o formato está correto.');
      } else {
        setDrivers(drivers);
        toast.success(`${drivers.length} motoristas importados com sucesso!`);
      }
    } catch (error) {
      console.error('Error processing file:', error);
      toast.error(error instanceof Error ? error.message : 'Erro ao processar o arquivo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  return (
    <div className="w-full animate-fade-in">
      <div
        className={`glass-card p-8 flex flex-col items-center justify-center border-2 border-dashed transition-all duration-300 ${
          isDragging ? 'border-blue-400 bg-blue-50 bg-opacity-50' : 'border-gray-300'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-600">Processando arquivo...</p>
          </div>
        ) : (
          <>
            <Upload size={48} className="text-blue-500 mb-4" />
            <h3 className="text-xl font-medium mb-2">Importar arquivo XLSX</h3>
            <p className="text-gray-500 text-center mb-6">
              Arraste e solte seu arquivo aqui ou clique para selecionar
            </p>
            
            <div className="flex flex-col gap-3 w-full max-w-md">
              <label 
                htmlFor="file-upload"
                className="bg-blue-500 text-white py-3 px-6 rounded-lg text-center cursor-pointer transition-transform hover:bg-blue-600 active:scale-[0.98] font-medium"
              >
                Selecionar Arquivo
              </label>
              <input
                id="file-upload"
                type="file"
                accept=".xlsx"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
            
            <div className="mt-6 flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <CheckCircle size={16} className="text-green-500" />
                <span>Detecta automaticamente motoristas e pedidos</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <FileWarning size={16} className="text-amber-500" />
                <span>Suporta apenas arquivos .xlsx</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FileUploader;
