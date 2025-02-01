'use client';
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Eye, EyeClosed, EyeClosedIcon, EyeIcon } from 'lucide-react';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';

const AgentSignup = () => {
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    phoneno: '',
    city: '',
    address: '',
    bname: '',
    role: 'customer',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  const router = useRouter();

  const userrole = useSelector((data) => data.user.role);

  useEffect(() => {
    if (userrole === 'admin' || userrole === 'superadmin') {
      router.push('/admin-dashboard/Analytics');
    } else if (userrole === 'agent') {
      router.push('/agent-dashboard/Analytics');
    }
  }, [userrole]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    if (name === 'password' || name === 'confirmPassword') {
      validatePasswords(formData.password, confirmPassword);
    }
  };

  const validatePasswords = (password, confirmPassword) => {
    setPasswordsMatch(password === confirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!passwordsMatch) {
      toast.error('Passwords do not match.');
      return;
    }
    try {
      const response = await axios.post('/api/admin/user/register', formData);
      toast.success(response.data.message || 'Signup successful!');
      setFormData({
        name: '',
        username: '',
        password: '',
        phoneno: '',
        city: '',
        address: '',
        bname: '',
        role: 'Customer',
      });
      setConfirmPassword('');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Signup failed. Please try again.');
    }
  };

  return (
    <div className="w-full h-screen md:h-screen flex justify-center items-center relative">
      <div className="hidden md:flex w-1/2 h-full">
        <img src="/bg/aeroplane.jpg" className="w-full h-full object-cover" />
      </div>
      <div className="md:w-1/2 z-10 mx-auto p-2 md:p-6 bg-white/70 backdrop-blur-md rounded-md">
        <img src="/logo/logo1.jpg" className="h-24 mx-auto mb-2 md:mb-4" />
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">User Signup</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-2 md:gap-6">
          {['name', 'username', 'phoneno', 'city', 'address', 'bname'].map((field) => (
            <div key={field}>
              <Label htmlFor={field} className="block text-sm font-medium text-gray-800">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </Label>
              <Input
                type="text"
                id={field}
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
                className="mt-1 w-full rounded-md border-gray-300 focus:ring-orange-500 focus:border-orange-500"
              />
            </div>
          ))}
          <div className="col-span-1">
            <Label htmlFor="role" className="block text-sm font-medium text-gray-800">
              Select Role
            </Label>
            <Select
              defaultValue={formData.role || 'Customer'}
              onValueChange={(value) =>
                setFormData((prevData) => ({ ...prevData, role: value }))
              }
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="customer">Customer</SelectItem>
                <SelectItem value="agent">Agent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 grid grid-cols-2 gap-2 md:gap-6 w-full">
            <div className="col-span-1 w-full">
              <Label htmlFor="password" className="block text-sm font-medium text-gray-800">
                Password
              </Label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  className={`mt-1 w-full rounded-md border-gray-300 focus:ring-orange-500 ${
                    passwordsMatch ? 'border-green-500' : 'focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                </button>
              </div>
            </div>
            <div className="col-span-1">
              <Label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-800"
              >
                Confirm Password
              </Label>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    validatePasswords(formData.password, e.target.value);
                  }}
                  required
                  className={`mt-1 w-full rounded-md border-gray-300 focus:ring-orange-500 ${
                    passwordsMatch ? 'border-green-500' : 'focus:border-orange-500'
                  }`}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-3 flex items-center text-sm text-gray-600"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <EyeIcon /> : <EyeClosedIcon />}
                </button>
              </div>
            </div>
          </div>
          <Button
            type="submit"
            className="w-full col-span-2 bg-orange-500 text-white font-medium py-2 px-4 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-300"
          >
            Signup
          </Button>
        </form>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AgentSignup;
