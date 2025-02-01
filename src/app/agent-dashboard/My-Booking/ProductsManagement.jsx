'use client';

import { useState, useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import { Loader } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

export default function AllBookings() {
  const userid = useSelector((state) => state.user.id);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      try {
       
        const packageBookingsResponse = await fetch(`/api/user/package-booking/${userid}`);
        const packageBookings = await packageBookingsResponse.json();

        const visaBookingsResponse = await fetch(`/api/user/visa-booking/${userid}`);
        const visaBookings = await visaBookingsResponse.json();

        const ticketBookingsResponse = await fetch(`/api/user/ticket-booking/${userid}`);
        const ticketBookings = await ticketBookingsResponse.json();

        // Combine all bookings into a single array
        const allBookings = [
          ...packageBookings.map((booking) => ({ ...booking, type: 'Package' })),
          ...visaBookings.map((booking) => ({ ...booking, type: 'Visa' })),
          ...ticketBookings.map((booking) => ({ ...booking, type: 'Ticket' })),
        ];

        setBookings(allBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [userid]);

  return (
    <div className=" mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">My Bookings</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin w-10 h-10 text-gray-600" />
        </div>
      ) : bookings.length > 0 ? (
        <table className="min-w-full table-auto border-collapse">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-2 text-left font-medium">Booking ID</th>
              <th className="px-4 py-2 text-left font-medium">Title</th>
              <th className="px-4 py-2 text-left font-medium">Type</th>
              <th className="px-4 py-2 text-left font-medium">Total Amount</th>
              <th className="px-4 py-2 text-left font-medium">Paid Amount</th>
              <th className="px-4 py-2 text-left font-medium">Remaining Amount</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className="border-b">
                <td className="px-4 py-2">{booking.booking_id || 'N/A'}</td>
                <td className="px-4 py-2">{booking.Packages?.title || booking.Tickets?.title || booking.Visa?.title || 'N/A'}</td>
                <td className="px-4 py-2">{booking.type}</td>
                <td className="px-4 py-2">{booking.total_amount || 'N/A'}</td>
                <td className="px-4 py-2">{booking.paid_amount || 'N/A'}</td>
                <td className="px-4 py-2">{booking.remaining_amount || 'N/A'}</td>
                <td className="px-4 py-2">{booking.status || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-center">No bookings found</p>
      )}
    </div>
  );
}
