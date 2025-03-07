import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Bell, User } from 'lucide-react';

export function TopBar() {
  const { user, signOut } = useAuth();

  return (
    <header className="bg-white shadow-sm">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1"></div>
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell className="h-5 w-5 text-gray-500" />
            </button>
            <div className="relative">
              <button className="flex items-center space-x-3 p-2 rounded-full hover:bg-gray-100">
                <User className="h-5 w-5 text-gray-500" />
                <span className="text-sm font-medium text-gray-700">{user?.email}</span>
              </button>
            </div>
            <button
              onClick={() => signOut()}
              className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}