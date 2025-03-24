
import * as XLSX from 'xlsx';
import { Driver } from '../context/DataContext';
import { v4 as uuidv4 } from 'uuid';

export const parseExcelFile = async (file: File): Promise<Driver[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const rows = XLSX.utils.sheet_to_json<Record<string, any>>(worksheet, { header: 1, defval: '' });

        const drivers: Driver[] = [];
        const today = new Date().toISOString().split('T')[0];

        // Search for Agente: and Serviços: patterns
        for (let i = 0; i < rows.length; i++) {
          const row = rows[i] as Array<any>;
          const firstCell = String(row[0] || '');

          if (firstCell.startsWith('Agente:')) {
            // Extract driver name
            const driverName = firstCell.replace('Agente:', '').trim();
            
            // Look for Serviços: in the next rows
            let servicesRow = -1;
            for (let j = i + 1; j < Math.min(i + 5, rows.length); j++) {
              const nextRow = rows[j] as Array<any>;
              const nextFirstCell = String(nextRow[0] || '');
              
              if (nextFirstCell.startsWith('Serviços:')) {
                servicesRow = j;
                break;
              }
            }

            if (servicesRow !== -1) {
              const servicesValue = String(rows[servicesRow][0] || '').replace('Serviços:', '').trim();
              const totalOrders = parseInt(servicesValue) || 0;

              // Look for Veículo: in nearby rows
              let vehicleValue = '';
              let region = '';
              
              for (let j = Math.max(0, i - 3); j < Math.min(i + 5, rows.length); j++) {
                const nearbyRow = rows[j] as Array<any>;
                const nearbyFirstCell = String(nearbyRow[0] || '');
                
                if (nearbyFirstCell.startsWith('Veículo:')) {
                  vehicleValue = nearbyFirstCell.replace('Veículo:', '').trim();
                  
                  if (vehicleValue.includes('RJ')) {
                    region = 'RJ';
                  } else if (vehicleValue.includes('SP')) {
                    region = 'SP';
                  }
                  
                  break;
                }
              }

              drivers.push({
                id: uuidv4(),
                date: today,
                name: driverName,
                vehicle: vehicleValue,
                region: region || 'Unknown',
                totalOrders,
                delivered: 0,
                pending: totalOrders,
                unsuccessful: 0,
                route: 0,
                deliveryPercentage: 0
              });
            }
          }
        }

        resolve(drivers);
      } catch (error) {
        console.error('Error parsing Excel file:', error);
        reject(new Error('Failed to parse Excel file. Please make sure it\'s a valid XLSX file.'));
      }
    };

    reader.onerror = () => {
      reject(new Error('Error reading the file. Please try again.'));
    };

    reader.readAsBinaryString(file);
  });
};

export const exportToExcel = (data: Driver[], filter: string) => {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Filter data based on the selected filter
  const filteredData = data.map(driver => {
    const basicData = {
      'Data': driver.date,
      'Motorista': driver.name,
      'Região': driver.region,
      'Rota': driver.route,
      'Total Pedidos': driver.totalOrders,
      'Entregues': driver.delivered,
      'Pendentes': driver.pending,
      'Insucessos': driver.unsuccessful,
      '% Entregas': `${driver.deliveryPercentage.toFixed(2)}%`
    };
    
    if (filter === 'all') return basicData;
    if (filter === 'totalOrders') return { 'Motorista': driver.name, 'Total Pedidos': driver.totalOrders };
    if (filter === 'delivered') return { 'Motorista': driver.name, 'Entregues': driver.delivered };
    if (filter === 'unsuccessful') return { 'Motorista': driver.name, 'Insucessos': driver.unsuccessful };
    
    return basicData;
  });
  
  // Convert the data to a worksheet
  const ws = XLSX.utils.json_to_sheet(filteredData);
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Relatório');
  
  // Generate a download link
  const now = new Date();
  const timestamp = `${now.getFullYear()}${(now.getMonth() + 1).toString().padStart(2, '0')}${now.getDate().toString().padStart(2, '0')}${now.getHours().toString().padStart(2, '0')}${now.getMinutes().toString().padStart(2, '0')}`;
  const fileName = `scanner_report_${timestamp}.xlsx`;
  
  // Write the workbook and trigger a download
  XLSX.writeFile(wb, fileName);
};
