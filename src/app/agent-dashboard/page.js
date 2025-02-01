'use client'
import React, { useState } from 'react';
import RoleCard from './components/RoleCard';
import LoginModal from './components/LoginModel';
import { UserCircleIcon, UserGroupIcon } from '@heroicons/react/24/outline';

const AdminLoginPage = () => {
  const [modalState, setModalState] = useState({
    isOpen: false,
    role: null,
  });

  const openModal = (role) => {
    setModalState({ isOpen: true, role });
  };

  const closeModal = () => {
    setModalState({ isOpen: false, role: null });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col items-center justify-center p-4">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-bold text-primary mb-4 tracking-tight">
          ALhabib Travel Agency
        </h1>
        <div className="h-1 w-32 bg-primary mx-auto rounded-full mb-4"></div>
        <p className="text-gray-600 text-lg">Welcome back! Please select your role to continue</p>
      </div>
      
      <div className="flex flex-wrap justify-center gap-8 max-w-4xl mx-auto">
        <RoleCard
          title="Admin"
          icon={UserCircleIcon}
          onClick={() => openModal('Admin')}
          description="Access administrative controls and manage system settings"
        />
        <RoleCard
          title="Agent"
          icon={UserGroupIcon}
          onClick={() => openModal('Agent')}
          description="Handle bookings and manage customer relationships"
        />
      </div>

      <LoginModal
        isOpen={modalState.isOpen}
        onClose={closeModal}
        role={modalState.role}
      />
    </div>
  );
};

export default AdminLoginPage;