import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { supabase } from '../lib/supabase';
import { User, Role } from '../types';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Select } from '../components/ui/Select';
import { Loader2, Plus, Trash2, Save } from 'lucide-react';
import { isValidEmail } from '../lib/utils';

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'Operario' as Role,
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setUsers(data || []);
    } catch (error) {
      toast.error('Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isValidEmail(newUser.email)) {
      toast.error('Por favor, introduce un correo electrónico válido');
      return;
    }

    try {
      const { data, error } = await supabase
        .from('users')
        .insert([{ ...newUser, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;

      setUsers([...users, data]);
      setNewUser({ name: '', email: '', role: 'Operario' });
      toast.success('Usuario creado correctamente');
    } catch (error) {
      toast.error('Error al crear el usuario');
    }
  };

  const handleUpdateUser = async (user: User) => {
    try {
      const { error } = await supabase
        .from('users')
        .update({ name: user.name, role: user.role })
        .eq('id', user.id);

      if (error) throw error;

      setUsers(users.map((u) => (u.id === user.id ? user : u)));
      setEditingId(null);
      toast.success('Usuario actualizado correctamente');
    } catch (error) {
      toast.error('Error al actualizar el usuario');
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este usuario?')) {
      return;
    }

    try {
      const { error } = await supabase.from('users').delete().eq('id', id);

      if (error) throw error;

      setUsers(users.filter((user) => user.id !== id));
      toast.success('Usuario eliminado correctamente');
    } catch (error) {
      toast.error('Error al eliminar el usuario');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Gestión de Usuarios</h1>

      <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Añadir nuevo usuario</h2>
        <form onSubmit={handleAddUser} className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <Input
              type="text"
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Correo electrónico
            </label>
            <Input
              type="email"
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <Select
              value={newUser.role}
              onChange={(e) => setNewUser({ ...newUser, role: e.target.value as Role })}
              required
            >
              <option value="Operario">Operario</option>
              <option value="Administrador">Administrador</option>
            </Select>
          </div>
          <div className="md:col-span-3">
            <Button type="submit">
              <Plus className="h-4 w-4 mr-2" />
              Añadir Usuario
            </Button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Nombre
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Correo electrónico
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Rol
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === user.id ? (
                    <Input
                      type="text"
                      value={user.name}
                      onChange={(e) =>
                        setUsers(
                          users.map((u) =>
                            u.id === user.id ? { ...u, name: e.target.value } : u
                          )
                        )
                      }
                    />
                  ) : (
                    <span className="text-sm text-gray-900">{user.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{user.email}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {editingId === user.id ? (
                    <Select
                      value={user.role}
                      onChange={(e) =>
                        setUsers(
                          users.map((u) =>
                            u.id === user.id
                              ? { ...u, role: e.target.value as Role }
                              : u
                          )
                        )
                      }
                    >
                      <option value="Operario">Operario</option>
                      <option value="Administrador">Administrador</option>
                    </Select>
                  ) : (
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        user.role === 'Administrador'
                          ? 'bg-purple-100 text-purple-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {user.role}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  {editingId === user.id ? (
                    <Button
                      size="sm"
                      onClick={() => handleUpdateUser(user)}
                      className="mr-2"
                    >
                      <Save className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setEditingId(user.id)}
                      className="mr-2"
                    >
                      Editar
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}