import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { LogEntry } from '../types';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Loader2, Download } from 'lucide-react';
import { format, subDays, subMonths, subYears } from 'date-fns';
import { es } from 'date-fns/locale';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';

const Logs = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [dateRange, setDateRange] = useState('last7days');

  useEffect(() => {
    const fetchLogs = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('logs')
        .select('*')
        .order('timestamp', { ascending: false });

      if (error) {
        toast.error('Error al cargar los registros');
      } else {
        setLogs(data || []);
      }
      setLoading(false);
    };

    fetchLogs();
  }, [dateRange]);

  const handleDownload = (format: 'csv' | 'xlsx' | 'pdf') => {
    if (logs.length === 0) {
      toast.error('No hay registros para descargar');
      return;
    }

    if (format === 'csv' || format === 'xlsx') {
      const worksheet = XLSX.utils.json_to_sheet(logs);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Logs');
      const fileName = `logs_${dateRange}.${format}`;
      XLSX.writeFile(workbook, fileName);
    } else if (format === 'pdf') {
      const doc = new jsPDF();
      const formattedData = logs.map((log) => [
        log.task_reference,
        log.previous_status,
        log.new_status,
        log.user_email,
        log.timestamp,
      ]);
      doc.autoTable({
        head: [['Referencia', 'Estado Anterior', 'Estado Nuevo', 'Usuario', 'Fecha']],
        body: formattedData,
      });
      doc.save(`logs_${dateRange}.pdf`);
    }
  };

  return (
    <div>
      <h1>Registros</h1>
      <div>
        <Select
          value={dateRange}
          onChange={(e) => setDateRange(e.target.value)}
        >
          <option value="last7days">Últimos 7 días</option>
          <option value="last30days">Últimos 30 días</option>
          <option value="lastYear">Último año</option>
        </Select>
        <Button
          onClick={() => handleDownload('csv')}
          disabled={loading}
        >
          Descargar CSV
        </Button>
        <Button
          onClick={() => handleDownload('xlsx')}
          disabled={loading}
        >
          Descargar Excel
        </Button>
        <Button
          onClick={() => handleDownload('pdf')}
          disabled={loading}
        >
          Descargar PDF
        </Button>
      </div>
      {loading ? (
        <Loader2 />
      ) : (
        <table>
          <thead>
            <tr>
              <th>Referencia</th>
              <th>Estado Anterior</th>
              <th>Estado Nuevo</th>
              <th>Usuario</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{log.task_reference}</td>
                <td>{log.previous_status}</td>
                <td>{log.new_status}</td>
                <td>{log.user_email}</td>
                <td>{log.timestamp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Logs; // <--- Aquí aseguramos la exportación por defecto

// ... rest of the file remains the same ...