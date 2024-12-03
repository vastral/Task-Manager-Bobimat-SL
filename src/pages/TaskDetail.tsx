import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { Task, TaskStatus } from '../types';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Select';
import { Loader2, ArrowLeft } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function TaskDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuthStore();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [id]);

  const fetchTask = async () => {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setTask(data);
    } catch (error) {
      toast.error('Error al cargar la tarea');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const updateTaskStatus = async (newStatus: TaskStatus) => {
    if (!task || !user) return;

    setUpdating(true);
    try {
      const updates = {
        status: newStatus,
        previous_status: task.status,
        updated_by: user.email,
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', task.id);

      if (error) throw error;

      // Create log entry
      const { error: logError } = await supabase.from('logs').insert({
        task_reference: task.reference,
        previous_status: task.status,
        new_status: newStatus,
        user_email: user.email,
        user_name: user.name,
        timestamp: new Date().toISOString(),
      });

      if (logError) throw logError;

      setTask({ ...task, ...updates });
      toast.success('Estado actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el estado');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!task) {
    return null;
  }

  return (
    <div>
      <Button
        variant="ghost"
        className="mb-6"
        onClick={() => navigate('/dashboard')}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Volver al dashboard
      </Button>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Tarea: {task.reference}
            </h1>
            <p className="text-sm text-gray-500">
              Creada el{' '}
              {format(new Date(task.created_at), "d 'de' MMMM 'de' yyyy", {
                locale: es,
              })}
            </p>
          </div>
          {isAdmin() && (
            <Button
              variant="outline"
              onClick={() => navigate(`/task/${task.id}/edit`)}
            >
              Editar referencia
            </Button>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado actual
            </label>
            <Select
              value={task.status}
              onChange={(e) => updateTaskStatus(e.target.value as TaskStatus)}
              disabled={updating}
            >
              <option value="Taller">Taller</option>
              <option value="Presupuesto">Presupuesto</option>
              <option value="Pendiente de repuesto">Pendiente de repuesto</option>
              <option value="Hecho">Hecho</option>
            </Select>
          </div>

          {task.previous_status && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado anterior
              </label>
              <p className="text-gray-900">{task.previous_status}</p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Última actualización
            </label>
            <p className="text-gray-900">Por: {task.updated_by}</p>
            <p className="text-sm text-gray-500">
              {format(new Date(task.updated_at), "d 'de' MMMM 'de' yyyy", {
                locale: es,
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}