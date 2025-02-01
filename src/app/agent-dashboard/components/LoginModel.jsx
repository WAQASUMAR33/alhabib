import React, { useState } from 'react';
import Modal from 'react-modal';
import { useRouter } from 'next/navigation'; // Import router from Next.js

const LoginModal = ({ isOpen, onClose, role }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter(); // Initialize the router

  const validateAdmin = (email, password) => {
    return email === 'admin@gmail.com' && password === 'admin';
  };

  const validateAgent = (email, password) => {
    return email === 'agent@gmail.com' && password === 'agent';
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = formData;

    if (role === 'Admin' && validateAdmin(email, password)) {
      console.log('Admin login successful');
      router.push('/admin-dashboard'); // Redirect to Admin dashboard
    } else if (role === 'Agent' && validateAgent(email, password)) {
      console.log('Agent login successful');
      router.push('/agent-dashboard'); // Redirect to Agent dashboard
    } else {
      setErrorMessage('Invalid email or password');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white p-8 rounded-2xl shadow-2xl w-[450px]"
      overlayClassName="fixed inset-0 bg-black/50 backdrop-blur-sm"
    >
      <div className="flex flex-col space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-primary">{role} Login</h2>
          <p className="text-gray-600 mt-2">Welcome back! Please enter your details</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {errorMessage && (
            <div className="text-red-500 text-sm font-medium">{errorMessage}</div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-primary rounded border-gray-300 focus:ring-primary"
              />
              <span className="text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-primary hover:text-primary/80">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            Sign In
          </button>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close modal"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </Modal>
  );
};

export default LoginModal;
