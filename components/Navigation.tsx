'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Home, Dumbbell, Calculator, BarChart3, Menu, LogOut, BicepsFlexed  } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface NavigationProps {
  activeView: 'dashboard' | 'workouts' | 'bmi' | 'reports' | 'trainer';
  setActiveView: (view: 'dashboard' | 'workouts' | 'bmi' | 'reports' | 'trainer') => void;
}

export default function Navigation({ activeView, setActiveView }: NavigationProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const router = useRouter();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'bmi', label: 'BMI Calculator', icon: Calculator },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'trainer', label: 'AI Trainer', icon: BicepsFlexed },
    { id: 'logout', label: 'Logout', icon: LogOut },
  ] as const;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsOpen(false); // Close the sheet before navigating
    setShowLogoutDialog(false); // Close the dialog
    router.push('/auth');
  };

  const confirmLogout = () => {
    setShowLogoutDialog(true);
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
                confirmLogout();
              } else {
                setActiveView(item.id as 'dashboard' | 'workouts' | 'bmi' | 'reports' | 'trainer');
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
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <Image
                src="/logo/logo-black.svg"
                alt="FitTracker Logo"
                width={70}
                height={70}
                className="rounded-lg"
                priority
              />
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
              <SheetContent side="right" className="w-72" aria-hidden={false}>
                <SheetHeader>
                  <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
                </SheetHeader>
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

      {/* Logout Confirmation Dialog */}
      <AlertDialog open={showLogoutDialog} onOpenChange={setShowLogoutDialog}>
        <AlertDialogContent className="sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              Confirm Logout
            </AlertDialogTitle>
            <AlertDialogDescription className="text-gray-600">
              Are you sure you want to logout?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel className="w-full sm:w-auto">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleLogout}
              className="w-full sm:w-auto bg-red-600 hover:bg-red-700 focus:ring-red-600"
            >
              Logout
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}