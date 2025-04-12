import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, Bell, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/fashion', icon: ShoppingBag, label: 'Fashion' },
    { path: '/notifications', icon: Bell, label: 'Alerts' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-lg z-[100]">
      <div className="flex justify-around items-center h-16 px-6 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Button
              key={item.path}
              variant="ghost"
              size="sm"
              asChild
              className={`flex flex-col items-center gap-1 h-auto py-2 ${
                isActive ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              <Link to={item.path}>
                <Icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
