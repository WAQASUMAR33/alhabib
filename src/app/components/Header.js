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
          console.log(notificationsData.data);
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
    e.preventDefault(); // Ensure the form submission is prevented
    setIsLoading(true);
    setErrorMessage('');
  
    try {
      console.log("Hello...");
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
    <header className="fixed top-0 w-full h-12 md:h-16 bg-white backdrop-blur-sm text-black border-b flex items-center px-6 md:px-10 z-40">
      <div className="flex justify-between items-center w-full">
        <Image src='/logo/logo1.jpg' alt="AlHabib Logo" width={1000} height={1000} className="md:h-16 h-12 w-auto  p-1" />

        <nav className="hidden md:flex gap-8 text-lg">
          {navItems.map(({ href, label }) => (
            <Link key={label} href={href} className="hover:text-blue-500">
              {label}
            </Link>
          ))}
        </nav>

        <div className='hidden md:flex items-center gap-4'>
          {username && (
            <Button onClick={() => setIsNotificationSheetOpen(true)} className="relative bg-transparent hover:bg-gray-100/50 rounded-full">
              <Bell className="w-6 h-6 text-black" />
              {notifications && notifications.length > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 text-xs text-white bg-red-600 rounded-full flex items-center justify-center">
                  {notifications.length}
                </span>
              )}
            </Button>
          )}
          {username ? (
            <>
              {userRole === 'agent' && <Link href='/admin' className='px-4 py-1 rounded-full border hover:bg-blue-100'>Dashboard</Link>}
              <Button onClick={() => dispatch(Logout())} variant="destructive">Logout</Button>
              <span>{username}</span>
            </>
          ) : (
            <>
              <Button onClick={() => setIsLoginModalOpen(true)} variant="outline">Login</Button>
              <Link href="/User-Registeration">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          className="md:hidden"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <Menu />
        </Button>
      </div>

      {isMobileMenuOpen && (
        <nav className="absolute top-12 left-0 w-full bg-white border-b shadow-lg flex flex-col items-center gap-6 py-6 md:hidden">
          {navItems.map(({ href, label }) => (
            <Link key={label} href={href} className="hover:text-blue-500" onClick={() => setIsMobileMenuOpen(false)}>
              {label}
            </Link>
          ))}
          {/* Mobile auth buttons */}
          {username ? (
            <>
              <Button onClick={() => dispatch(Logout())} variant="destructive">Logout</Button>
              <span>{username}</span>
            </>
          ) : (
            <>
              <Button onClick={() => setIsLoginModalOpen(true)} variant="outline">Login</Button>
              <Link href="/User-Registeration">
                <Button>Sign Up</Button>
              </Link>
            </>
          )}
        </nav>
      )}

      <Dialog open={isLoginModalOpen} onOpenChange={setIsLoginModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>User Login</DialogTitle>
            <DialogDescription>Welcome back! Please enter your details</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleLogin} className="space-y-4">
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? <Loader className="animate-spin mr-2" /> : null}
              Sign In
            </Button>
          </form>
        </DialogContent>
      </Dialog>

      <Sheet open={isNotificationSheetOpen} onOpenChange={setIsNotificationSheetOpen}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Notifications</SheetTitle>
            <SheetDescription>Your latest notifications</SheetDescription>
          </SheetHeader>
          <div className="mt-4 space-y-2">
            {notifications && notifications.length > 0 ? notifications.map((notification, index) => (
              <div key={index} className="p-2 bg-gray-100 rounded shadow">
                <p className='font-semibold'>Message</p>
                <p>{notification.message}</p>
                <span className="text-xs text-gray-500">{new Date(notification.created_at).toLocaleString()}</span>
              </div>
            )) : (
              <p className="text-gray-500">No notifications available.</p>
            )}
          </div>
        </SheetContent>
      </Sheet>

      <Toaster />
    </header>
  );
}

