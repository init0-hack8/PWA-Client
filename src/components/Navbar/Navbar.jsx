import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const navigate = useNavigate();

  const handleMenuItemClick = (option) => {
    if (option === 'profile') {
      navigate('/profile');
    } else if (option === 'logout') {
      localStorage.removeItem('token');
      navigate('/login');
    }
  };

  return (
    <nav className="border-b bg-background">
      <div className="container flex h-16 items-center px-4">
        <div className="mr-4 hidden md:flex">
          <h2 className="text-lg font-semibold">Hack 8</h2>
        </div>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeToggle />
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/path-to-avatar.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleMenuItemClick('profile')}>
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleMenuItemClick('logout')}>
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;