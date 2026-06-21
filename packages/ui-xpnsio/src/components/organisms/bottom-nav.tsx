'use client';

import type { ComponentType } from 'react';

export interface BottomNavItem {
  icon: ComponentType<{ size?: number }>;
  label: string;
  path: string;
  fab?: boolean;
}

interface BottomNavProps {
  items: BottomNavItem[];
  currentPath: string;
  onNavigate: (path: string) => void;
}

export function BottomNav({ items, currentPath, onNavigate }: BottomNavProps) {
  const isActive = (path: string) => currentPath === path || currentPath.startsWith(path + '/');

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background px-6 py-3">
      <div className="max-w-2xl mx-auto flex items-center">
        {items.map((item) => {
          const Icon = item.icon;

          if (item.fab) {
            return (
              <button
                key={item.path}
                className="flex-1 flex justify-center"
                onClick={() => onNavigate(item.path)}
              >
                <div className="-mt-6 w-14 h-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:opacity-90">
                  <Icon size={24} />
                </div>
              </button>
            );
          }

          return (
            <button
              key={item.path}
              className={`flex-1 flex flex-col items-center gap-1 text-xs transition-colors ${isActive(item.path) ? 'text-foreground' : 'text-muted-foreground hover:text-foreground'}`}
              onClick={() => onNavigate(item.path)}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
