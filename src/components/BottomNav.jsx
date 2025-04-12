import { Link, useLocation } from 'react-router-dom';
import { Home, Search, ShoppingBag, User } from 'lucide-react';

export function BottomNav() {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/search', icon: Search, label: 'Search' },
    { path: '/fashion', icon: ShoppingBag, label: 'Fashion' },
    { path: '/profile', icon: User, label: 'Profile' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 shadow-lg z-50">
      <div className="h-full max-w-screen-xl mx-auto">
        <div className="flex h-full">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center justify-center flex-1 ${
                  isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs font-medium mt-1">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
} 