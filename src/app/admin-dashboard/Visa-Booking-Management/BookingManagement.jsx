'use client';

import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, TrashIcon } from 'lucide-react'; // Import icons from lucide-react
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Loader } from 'lucide-react'; // Import loading icon
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

// Fetch all bookings
const fetchBookings = async () => {
  const response = await fetch('/api/admin/visa-booking');
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};

// Update booking status
const updateBookingStatus = async (id, status) => {
  const response = await fetch(`/api/admin/visa-booking/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update booking status');
  }
  return response.json();
};

// Delete booking
const deleteBooking = async (id) => {
  const response = await fetch(`/api/admin/visa-booking/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete booking');
  }
  return true;
};

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const uid = useSelector((state) => state.user.id);

  useEffect(() => {
    fetchBookings()
      .then(setBookings)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    setFilteredBookings(
      bookings.filter(
        (booking) =>
          String(booking.user_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(booking.visa_id).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [bookings, searchTerm]);

  const handleApprove = async (id) => {
    setLoadingAction(id);
    // Optimistic update
    const updatedBookings = bookings.map((booking) =>
      booking.booking_id === id ? { ...booking, status: 'Approved' } : booking
    );
    setBookings(updatedBookings);
    try {
      await updateBookingStatus(id, 'Approved');
      toast.success('Booking approved');
    } catch (err) {
      toast.error(err.message);
      // Revert the optimistic update in case of error
      setBookings(bookings);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleReject = async (id) => {
    setLoadingAction(id);
    // Optimistic update
    const updatedBookings = bookings.map((booking) =>
      booking.booking_id === id ? { ...booking, status: 'Rejected' } : booking
    );
    setBookings(updatedBookings);
    try {
      await updateBookingStatus(id, 'Rejected');
      toast.success('Booking rejected');
    } catch (err) {
      toast.error(err.message);
      // Revert the optimistic update in case of error
      setBookings(bookings);
    } finally {
      setLoadingAction(null);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this booking?')) {
      setLoadingAction(id);
      // Optimistic update
      const updatedBookings = bookings.filter((booking) => booking.booking_id !== id);
      setBookings(updatedBookings);
      try {
        await deleteBooking(id);
        toast.success('Booking deleted successfully');
      } catch (err) {
        toast.error(err.message);
        // Revert the optimistic update in case of error
        setBookings(bookings);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-auto max-h-[72vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>User Name</TableHead>
                  <TableHead>User Email</TableHead>
                  <TableHead>Visa Name</TableHead>
                  <TableHead>Visa Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking, index) => (
                  <TableRow key={booking.booking_id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{booking.Users?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.Users?.username || 'N/A'}</TableCell>
                    <TableCell>{booking.Visa?.title || 'N/A'}</TableCell>
                    <TableCell>{booking.Visa?.amount || 'N/A'}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleApprove(booking.booking_id)}
                        variant="ghost"
                        disabled={loadingAction === booking.booking_id || booking.status === 'Approved'}
                      >
                        {loadingAction === booking.booking_id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                      </Button>
                      <Button
                        onClick={() => handleReject(booking.booking_id)}
                        variant="ghost"
                        disabled={loadingAction === booking.booking_id || booking.status === 'Rejected'}
                      >
                        {loadingAction === booking.booking_id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-600" />
                        )}
                      </Button>
                      <Button
                        onClick={() => handleDelete(booking.booking_id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === booking.booking_id}
                      >
                        {loadingAction === booking.booking_id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
