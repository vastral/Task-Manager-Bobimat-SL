import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { LogOut, ClipboardList, Users, FileText, Plus, Search } from 'lucide-react';
import { Button } from './ui/Button';

export default function Layout() {
  const { user, isAdmin, setUser } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold text-blue-600">Bobimat SL</span>
              </div>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
                <Button
                  variant="ghost"
                  onClick={() => navigate('/dashboard')}
                >
                  <ClipboardList className="mr-2 h-4 w-4" />
                  Tareas
                </Button>
                {isAdmin() && (
                  <>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/users')}
                    >
                      <Users className="mr-2 h-4 w-4" />
                      Usuarios
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => navigate('/logs')}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      Registros
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/task/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nueva Tarea
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/task/search')}
              >
                <Search className="mr-2 h-4 w-4" />
                Buscar Tarea
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-700">{user?.name}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>
    </div>
  );
}