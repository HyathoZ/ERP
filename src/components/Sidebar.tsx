import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  DollarSign,
  Users,
  Package,
  Clipboard,
  Factory,
  UserCircle,
  Receipt,
  BarChart3,
  Settings
} from 'lucide-react';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: DollarSign, label: 'Financeiro', path: '/financial' },
  { icon: Users, label: 'CRM', path: '/crm' },
  { icon: Package, label: 'Estoque', path: '/inventory' },
  { icon: Clipboard, label: 'Ordens de Serviço', path: '/service-orders' },
  { icon: Factory, label: 'Produção', path: '/production' },
  { icon: UserCircle, label: 'RH', path: '/hr' },
  { icon: Receipt, label: 'Fiscal', path: '/fiscal' },
  { icon: BarChart3, label: 'Relatórios', path: '/reports' },
  { icon: Settings, label: 'Configurações', path: '/settings' },
];

export function Sidebar() {
  return (
    <aside className="bg-gray-900 text-white w-64 min-h-screen p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Cloud ERP</h1>
      </div>
      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                }`
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
}