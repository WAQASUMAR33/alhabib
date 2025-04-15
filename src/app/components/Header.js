'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import axios from 'axios';
import { Bell, Loader, Menu } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from '@radix-ui/react-label';
import { AddUser, UpdateUser, Logout } from '@/app/Store/Slice';

// Import Inter font
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '600', '700'] });

export default function Header() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { id: userId, role: userRole, username } = useSelector((state) => state.user);

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isNotificationSheetOpen, setIsNotificationSheetOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (userId) {
        try {
          const { data: user } = await axios.get(`/api/user/${userId}`);
          dispatch(UpdateUser(user));
          const { data: notificationsData } = await axios.get(`/api/get-notifications/${userId}`);
          setNotifications(notificationsData.data);
        } catch (error) {
          console.error('Error fetching user details:', error);
          toast.error('Failed to fetch user details');
        }
      }
    };

    fetchUserDetails();
  }, [userId, dispatch]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    try {
      const { data } = await axios.post('/api/admin/user/login', loginForm);
      dispatch(AddUser(data.user));
      toast.success('Login successful! Redirecting to dashboard...');
      setIsLoginModalOpen(false);

      setTimeout(() => {
        const dashboardRoute = data.user.role === 'agent' ? '/agent-dashboard/Analytics' : '/admin-dashboard/Analytics';
        router.push(dashboardRoute);
      }, 1500);
    } catch (error) {
      const errorMsg = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'Error logging in. Please try again later.';
      toast.error(errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const navItems = [
    { href: '/', label: 'Home' },
    { href: '#services', label: 'Services' },
    { href: '#destinations', label: 'Destinations' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
    { href: '/', label: 'Flights' },
    { href: '/', label: 'Hotels' },
  ];

  return (
    <header className={`fixed top-0 w-full bg-white shadow-sm border-b border-gray-100 z-50 ${inter.className}`}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <Image 
            src='/logo/logo1.jpg' 
            alt="AlHabib Logo" 
            width={120} 
            height={40} 
            className="h-10 w-auto object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center space-x-8 text-sm font-medium text-gray-700">
          {navItems.map(({ href, label }) => (
            <Link 
              key={label} 
              href={href} 
              className="hover:text-blue-600 transition-colors duration-200"
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center space-x-4">
          {username ? (
            <>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsNotificationSheetOpen(true)} 
                className="relative hover:bg-gray-100 rounded-full"
              >
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications?.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </Button>
              {userRole === 'agent' && (
                <Link href='/admin'>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                  >
                    Dashboard
                  </Button>
                </Link>
              )}
              <span className="text-sm font-medium text-gray-600">{username}</span>
              <Button 
                onClick={() => dispatch(Logout())} 
                variant="outline" 
                className="border-red-200 text-red-600 hover:bg-red-50 font-medium"
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button 
                onClick={() => setIsLoginModalOpen(true)} 
                variant="outline" 
                className="border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
              >
                Login
              </Button>
              <Link href="/User-Registeration">
                <Button 
                  className="bg-blue-600 text-white hover:bg-blue-700 font-medium"
                >
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden text-gray-600 hover:bg-gray-100"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu className="w-6 h-6" />
        </Button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <nav className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="container mx-auto px-4 py-6 flex flex-col space-y-4">
            {navItems.map(({ href, label }) => (
              <Link 
                key={label} 
                href={href} 
                className="text-gray-700 hover:text-blue-600 text-sm font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}
            {username ? (
              <>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => {
                    setIsNotificationSheetOpen(true);
                    setIsMobileMenuOpen(false);
                  }} 
                  className="relative w-10 h-10 hover:bg-gray-100 rounded-full"
                >
                  <Bell className="w-5 h-5 text-gray-600" />
                  {notifications?.length > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 text-xs text-white bg-red-500 rounded-full flex items-center justify-center">
                      {notifications.length}
                    </span>
                  )}
                </Button>
                {userRole === 'agent' && (
                  <Link href='/admin' onClick={() => setIsMobileMenuOpen(false)}>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                    >
                      Dashboard
                    </Button>
                  </Link>
                )}
                <Button 
                  onClick={() => {
                    dispatch(Logout());
                    setIsMobileMenuOpen(false);
                  }} 
                  variant="outline" 
                  className="w-full border-red-200 text-red-600 hover:bg-red-50 font-medium"
                >
                  Logout
                </Button>
                <span className="text-sm font-medium text-gray-600">{username}</span>
              </>
            ) : (
              <>
                <Button 
                  onClick={() => {
                    setIsLoginModalOpen(true);
                    setIsMobileMenuOpen(false);
                  }} 
                  variant="outline" 
                  className="w-full border-gray-200 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium"
                >
                  Login
                </Button>
                <Link href="/User-Registeration" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button 
                    className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      )}

      {/* Login Modal */}
      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-semibold text-gray-900">User Login</DialogTitle>
            <DialogDescription className="text-gray-600">
              Welcome back! Please enter your details
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-6">
            {errorMessage && (
              <p className="text-red-500 text-sm font-medium">{errorMessage}</p>
            )}
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username
              </Label>
              <Input
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
                className="border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-blue-600 text-white hover:bg-blue-700 font-medium"
              disabled={isLoading}
            >
              {isLoading ? <Loader className="animate-spin mr-2 w-5 h-5" /> : null}
              Sign In
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      {/* Notification Sheet */}
      <Sheet open={isNotificationSheetOpen} onOpenChange={setIsNotificationSheetOpen}>
        <SheetContent className="sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="text-lg font-semibold text-gray-900">Notifications</SheetTitle>
            <SheetDescription className="text-gray-600">
              Your latest notifications
            </SheetDescription>
          </SheetHeader>
          <div className="mt-6 space-y-4">
            {notifications?.length > 0 ? (
              notifications.map((notification, index) => (
                <div 
                  key={index} 
                  className="p-4 bg-gray-50 rounded-lg shadow-sm border border-gray-100"
                >
                  <p className="font-semibold text-gray-800">Message</p>
                  <p className="text-gray-600">{notification.message}</p>
                  <span className="text-xs text-gray-500">
                    {new Date(notification.created_at).toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">No notifications available.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Toaster />
    </header>
  );
}