import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, Users, FileText } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import MenuItem from './MenuItem';

export default function Navigation() {
  const navigate = useNavigate();
  const { isAdmin } = useAuthStore();

  const menuItems = [
    {
      name: 'Tareas',
      icon: ClipboardList,
      path: '/dashboard',
      show: true,
    },
    {
      name: 'Usuarios',
      icon: Users,
      path: '/users',
      show: isAdmin(),
    },
    {
      name: 'Registros',
      icon: FileText,
      path: '/logs',
      show: isAdmin(),
    },
  ];

  return (
    <nav className="flex-1 mt-5 px-2">
      <div className="space-y-1">
        {menuItems
          .filter((item) => item.show)
          .map((item) => (
            <MenuItem
              key={item.path}
              name={item.name}
              path={item.path}
              icon={item.icon}
              onClick={() => navigate(item.path)}
            />
          ))}
      </div>
    </nav>
  );
}