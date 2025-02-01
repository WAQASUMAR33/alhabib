'use client';

import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import { FaPlane, FaPassport, FaArrowUp, FaArrowDown } from 'react-icons/fa';

// Register Chart.js components
ChartJS.register(
  BarElement,
  CategoryScale,
  LinearScale,
  DoughnutController,
  ArcElement,
  LineElement,
  PointElement,
  Tooltip,
  Legend
);

// Card Component
const Card = ({ title, value, icon }) => {
  const Icon = icon;
  return (
    <div className="bg-white p-6 rounded-lg shadow-md border">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-gray-500 text-sm">{title}</h4>
        <Icon className="text-gray-400 text-xl" />
      </div>
      <div className="text-2xl font-semibold">{value}</div>
    </div>
  );
};

// Fetch Data Hook
const useAnalyticsData = () => {
  const [data, setData] = useState({
    flightBookingPending: 0,
    flightBookingApproved: 0,
    groupflightBookingPending: 0,
    groupflightBookingApproved: 0,
    hotelBookingPending: 0,
    hotelBookingApproved: 0,
    paymentPending: 0,
    paymentApproved: 0,
  });

  const fetchData = async () => {
    try {
      const [flightPending, flightApproved, hotelPending, hotelApproved, paymentPending, paymentApproved] = await Promise.all([
        fetch('/api/Analytics/FlightBooking/Pending').then((res) => res.json()),
        fetch('/api/Analytics/FlightBooking/Approved').then((res) => res.json()),
        fetch('/api/Analytics/HotelBooking/Pending').then((res) => res.json()),
        fetch('/api/Analytics/HotelBooking/Approved').then((res) => res.json()),
        fetch('/api/Analytics/Payments/Pending').then((res) => res.json()),
        fetch('/api/Analytics/Payments/Approved').then((res) => res.json()),
      ]);

      setData({
        flightBookingPending: flightPending?.flightBookings?.count || 0,
        flightBookingApproved: flightApproved?.flightBookings?.count || 0,
        groupflightBookingPending: flightPending?.groupFlightBookings?.count || 0,
        groupflightBookingApproved: flightApproved?.groupFlightBookings?.count || 0,
        hotelBookingPending: hotelPending?.hotelBookings?.count || 0,
        hotelBookingApproved: hotelApproved?.hotelBookings?.count || 0,
        paymentPending: paymentPending?.paymentRequests?.count || 0,
        paymentApproved: paymentApproved?.paymentRequests?.count || 0,
      });
    } catch (error) {
      console.error('Failed to fetch analytics data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return data;
};

// Bar Chart for Revenue by Service
const RevenueByService = ({ data }) => {
  const chartData = {
    labels: ['Flight Bookings', 'Hotel Bookings', 'Payments'],
    datasets: [
      {
        label: 'Revenue',
        data: [
          data.flightBookingApproved,
          data.hotelBookingApproved,
          data.paymentApproved,
        ],
        backgroundColor: ['#3B82F6', '#10B981', '#F59E0B'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h4 className="text-gray-500 text-sm mb-4">Stats</h4>
      <Bar data={chartData} options={options} />
    </div>
  );
};

// Doughnut Chart for Booking Status
const BookingStatus = ({ data }) => {
  const chartData = {
    labels: ['Approved', 'Pending'],
    datasets: [
      {
        label: 'Bookings',
        data: [
          data.flightBookingApproved + data.hotelBookingApproved,
          data.flightBookingPending + data.hotelBookingPending,
        ],
        backgroundColor: ['#10B981', '#3B82F6'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
  };

  return (
    <div className="bg-white p-6 rounded-lg border">
      <h4 className="text-gray-500 text-sm mb-4">Booking Status Distribution</h4>
      <Doughnut data={chartData} options={options} />
    </div>
  );
};

// Main Analytics Page Component
const TravelAnalyticsPage = () => {
  const analyticsData = useAnalyticsData();

  return (
    <div className="bg-gray-100 min-h-screen p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card title="Pending Flight Bookings" value={analyticsData.flightBookingPending} icon={FaPlane} />
        <Card title="Approved Flight Bookings" value={analyticsData.flightBookingApproved} icon={FaPlane} />
        <Card title="Pending Group Flight Bookings" value={analyticsData.groupflightBookingPending} icon={FaPlane} />
        <Card title="Approved Group Flight Bookings" value={analyticsData.groupflightBookingApproved} icon={FaPlane} />
        <Card title="Pending Hotel Bookings" value={analyticsData.hotelBookingPending} icon={FaPassport} />
        <Card title="Approved Hotel Bookings" value={analyticsData.hotelBookingApproved} icon={FaPassport} />
        <Card title="Pending Payments" value={analyticsData.paymentPending} icon={FaArrowDown} />
        <Card title="Approved Payments" value={analyticsData.paymentApproved} icon={FaArrowUp} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <RevenueByService data={analyticsData} />
        <BookingStatus data={analyticsData} />
      </div>
    </div>
  );
};

export default TravelAnalyticsPage;
