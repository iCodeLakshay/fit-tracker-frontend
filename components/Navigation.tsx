'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Home, Dumbbell, Calculator, BarChart3, Menu, LogOut  } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface NavigationProps {
  activeView: 'dashboard' | 'workouts' | 'bmi' | 'reports';
  setActiveView: (view: 'dashboard' | 'workouts' | 'bmi' | 'reports') => void;
}

export default function Navigation({ activeView, setActiveView }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'bmi', label: 'BMI Calculator', icon: Calculator },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ] as const;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    router.push('/auth');
  };

  const MenuContent = ({ mobile = false }: { mobile?: boolean }) => (
    <nav className={`${mobile ? 'flex flex-col space-y-2' : 'flex space-x-1'}`}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeView === item.id;
        
        return (
          <Button
            key={item.id}
            variant={isActive ? 'default' : 'ghost'}
            size={mobile ? 'lg' : 'sm'}
            onClick={() => {
              if (item.id === 'logout') {
                handleLogout();
              } else {
                setActiveView(item.id as 'dashboard' | 'workouts' | 'bmi' | 'reports');
              }
              if (mobile) setIsOpen(false);
            }}
            className={`${mobile ? 'justify-start' : ''} ${
              isActive 
                ? 'bg-blue-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            <Icon className={`h-4 w-4 ${mobile ? 'mr-3' : 'mr-2'}`} />
            {item.label}
          </Button>
        );
      })}
    </nav>
  );

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
              <Dumbbell className="h-5 w-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-gray-900">FitTracker</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <MenuContent />
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Dumbbell className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">FitTracker</h1>
              </div>
              <MenuContent mobile />
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}