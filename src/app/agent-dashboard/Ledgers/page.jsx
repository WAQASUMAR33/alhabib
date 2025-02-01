'use client'
import React, { useRef, useState } from 'react';
import LedgerManagement from './LedgerMainPage';

const ParentComponent = () => {
  const childRef = useRef();
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');

  const handleFilter = () => {
    if (childRef.current) {
      childRef.current.filterByDate();
    }
  };

  return (
    <div className=''>
      {/* Date Inputs */}
      <div className="flex space-x-4 mb-4 justify-end mr-4">
        <input
          type="date"
          value={date1}
          onChange={(e) => setDate1(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
        <input
          type="date"
          value={date2}
          onChange={(e) => setDate2(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2"
        />
        <button
          onClick={handleFilter}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Filter
        </button>
      </div>

      {/* Child Component */}
      <LedgerManagement ref={childRef} date1={date1} date2={date2} />
    </div>
  );
};

export default ParentComponent;
