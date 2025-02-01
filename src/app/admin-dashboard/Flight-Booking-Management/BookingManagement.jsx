'use client';

import { toast, ToastContainer } from 'react-toastify';
import { useState, useEffect } from 'react';
import { EyeIcon, Loader, CheckCircle, XCircle } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';

import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

const fetchBookings = async () => {
  const response = await fetch('/api/admin/flight-booking');
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};

const updateBookingStatus = async (id, status) => {
  const response = await fetch(`/api/admin/flight-booking/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  if (!response.ok) {
    throw new Error('Failed to update booking status');
  }
  return response.json();
};

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
          String(booking.agent_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(booking.FlightDetails?.airline).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [bookings, searchTerm]);

  const handleAction = async (id, action) => {
    try {
      await updateBookingStatus(id, action);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: action } : b))
      );
      toast.success(`Booking ${action.toLowerCase()}ed`);
    } catch (err) {
      toast.error(err.message);
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
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Airline</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking, index) => (
                  <TableRow key={booking.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{booking.Users?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.FlightDetails?.airline || 'N/A'}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="ghost">
                            <EyeIcon className="h-5 w-5 text-blue-600" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="w-[90%] sm:w-[600px] p-6 bg-white rounded-md shadow-lg">
                          <DialogTitle className="text-xl font-bold mb-4">Flight Details</DialogTitle>
                          <DialogDescription className="text-sm mb-4">
                            Here are the details for this flight booking.
                          </DialogDescription>
                          <div className="space-y-4">
                            <p><strong>Agent Name:</strong> {booking.Users?.name}</p>
                            <p><strong>Airline:</strong> {booking.FlightDetails?.airline}</p>
                            <Table className="min-w-full border-collapse border border-gray-300">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="border border-gray-300 p-2">Flight No</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Origin</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Destination</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {booking.FlightDetails?.SingleFlight?.length > 0 ? (
                                  <>
                                   {booking.FlightDetails?.SingleFlight?.map((flight, idx) => (
                                    <TableRow>
                                    <TableCell className="border border-gray-300 p-2"> {flight.flight_number || 'N/A'}
                                    </TableCell>
                                    <TableCell className="border border-gray-300 p-2"> {flight.origin}
                                  </TableCell>
                                    <TableCell className="border border-gray-300 p-2"> {flight.destination}
                                    </TableCell>
                                    </TableRow>
                                   ))}
                               
                                  </>
                                     )
                                : (
                                  <TableRow>
                                    <TableCell colSpan={3} className="border border-gray-300 p-2 text-center">
                                      No Flight Details Available
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                            <p><strong>Flight Type:</strong> {booking.FlightDetails?.type}</p>
                            <p><strong>Status:</strong> {booking.status}</p>
                            <div>
                              <strong>Passengers:</strong>
                              <ul className="list-disc pl-5">
                                {booking.Passengers.map((p) => (
                                  <li key={p.id}>
                                    {p.title} {p.givenname} {p.surname} ({p.type})
                                  </li>
                                ))}
                              </ul>
                            </div>

                            <div className="mt-4">
                              <input type="file" className="block mb-3" />
                              <div className="flex justify-end space-x-4 mt-4">
                                <Button
                                  onClick={() => handleAction(booking.id, 'Approved')}
                                  className="bg-green-500 hover:bg-green-600"
                                >
                                  Approve
                                </Button>
                                <Button
                                  onClick={() => handleAction(booking.id, 'Rejected')}
                                  className="bg-red-500 hover:bg-red-600"
                                >
                                  Reject
                                </Button>
                              </div>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
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
