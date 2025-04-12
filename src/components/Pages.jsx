import { Outlet } from 'react-router-dom';
import { BottomNav } from './BottomNav';

export function Pages() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16">
        <Outlet />
      </main>
      <BottomNav />
    </div>
  );
} 