import React from 'react';

const RoleCard = ({ title, icon: Icon, onClick, description }) => {
  return (
    <div
      onClick={onClick}
      className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer w-80 flex flex-col items-center space-y-6 transform hover:-translate-y-1"
    >
      <div className="bg-primary/10 p-4 rounded-full">
        <Icon className="w-12 h-12 text-primary" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-2xl font-bold text-primary">{title}</h3>
        <p className="text-gray-600 text-sm">{description}</p>
      </div>
      <button className="mt-4 px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors duration-300">
        Login as {title}
      </button>
    </div>
  );
};

export default RoleCard;