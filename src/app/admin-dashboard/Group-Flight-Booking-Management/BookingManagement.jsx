'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { EyeIcon, Loader2, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import 'react-toastify/dist/ReactToastify.css';

const fetchBookings = async () => {
  const response = await fetch('/api/admin/group-flight-booking');
  if (!response.ok) {
    throw new Error('Failed to fetch bookings');
  }
  return response.json();
};

const updateBookingStatus = async (id, status, attachment) => {
  const response = await fetch(`/api/admin/group-flight-booking/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status, image: attachment }),
  });
  if (!response.ok) {
    const data = await response.json();
    console.log("data received",data)
    throw new Error(data.message||'Failed to update booking status');
  }
  return response.json();
};

export default function BookingManagement() {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [attachment, setAttachment] = useState(null);
  const [date1, setDate1] = useState('');
    const [date2, setDate2] = useState('');
  const [loadingAction, setLoadingAction] = useState('');
  const [trigger, settrigger]=useState(false)

  useEffect(() => {
    fetchBookings()
      .then(setBookings)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, [trigger]);

  useEffect(() => {
    setFilteredBookings(
      bookings.filter(
        (booking) =>
          String(booking.price).includes(searchTerm) ||
          String(booking.agent_id).toLowerCase().includes(searchTerm.toLowerCase()) ||
          String(booking.FlightAirline?.name).toLowerCase().includes(searchTerm.toLowerCase())||
          String(booking.Users?.name).toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [bookings, searchTerm]);

  const handleAction = async (id, action) => {
    setLoadingAction(action)
    try {
      await updateBookingStatus(id, action, attachment);
      setBookings((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: action } : b))
      );
      toast.success(`Booking ${action.toLowerCase()}`);
      settrigger(!trigger)
      setDialogOpen(false);
      setLoadingAction('')
    } catch (err) {
      toast.error(err.message);
      setLoadingAction('')
    }
    setLoadingAction('')
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
  
    try {
      setLoadingAction('image');
      const imageUrl = await uploadImage(file);
      setAttachment(imageUrl);
      setLoadingAction('');
    } catch (error) {
      toast.error(`Image upload failed: ${error}`);
      setLoadingAction('');
    }
  };

  const uploadImage = async (imageFile) => {
    const reader = new FileReader();
    return new Promise((resolve, reject) => {
      reader.onload = async () => {
        try {
          const response = await fetch(`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_API}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ image: reader.result }),
          });
          if (!response.ok) throw new Error('Failed to upload image');
          const data = await response.json();
          resolve(data.image_url);
        } catch (error) {
          reject(error.message);
        }
      };
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(imageFile);
    });
  };

  const handleSetDialogOpen = (booking) => {
    setSelectedBooking(booking);
    setDialogOpen(true);
  };
  const filterByDate = () => {
    if (!date1 || !date2) {
      toast.error('Please select both start and end dates.');
      return;
    }

    const start = new Date(date1);
    const end = new Date(date2);

    const filtered = bookings.filter((entry) => {
      const entryDate = new Date(entry.created_at);
      return entryDate >= start && entryDate <= end;
    });

    setFilteredBookings(filtered);

    if (filtered.length === 0) {
      toast.info('No entries found for the selected date range.');
    }
  }; 

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6 flex justify-between">
          <Input
            type="text"
            placeholder="Search bookings..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-auto px-3 py-2 border rounded-md"
          />
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
          onClick={filterByDate}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          Filter
        </button>
      </div>
        </div>
        {isLoading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-auto max-h-[72vh]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Airline</TableHead>
                  <TableHead>Fare</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBookings.map((booking, index) => (
                  <TableRow key={booking.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{booking.Users?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.FlightAirline?.name || 'N/A'}</TableCell>
                    <TableCell>{booking.price}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>{new Date(booking.created_at).toLocaleString()}</TableCell>
                    <TableCell>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                        <DialogTrigger asChild>
                          <Button variant="ghost" onClick={() => handleSetDialogOpen(booking)}>
                            <EyeIcon className="h-5 w-5 text-blue-600" />
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-3xl p-6 bg-white rounded-md border shadow-lg max-h-[90vh] overflow-auto">
                          <DialogTitle className="text-xl font-bold mb-4">Flight Details</DialogTitle>
                          <DialogDescription className="text-sm mb-4">
                            Here are the details for this flight booking.
                          </DialogDescription>
                          <div className="space-y-2">
                            <p><strong>Agent Name:</strong> {selectedBooking?.Users?.name}</p>
                            <p><strong>Business Name:</strong> {selectedBooking?.Users?.bname}</p>
                            <p><strong>Airline:</strong> {selectedBooking?.FlightAirline?.name}</p>
                            <Table className="w-full border-collapse border border-gray-300">
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="border border-gray-300 p-2">Flight No</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Origin</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Destination</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Flight Date</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Departure Time</TableHead>
                                  <TableHead className="border border-gray-300 p-2">Arrival Time</TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {selectedBooking && (
                                  <>
                                    <TableRow>
                                      <TableCell className="border border-gray-300 p-2">{selectedBooking?.SingleGroupFlight?.flight_number || 'N/A'}</TableCell>
                                      <TableCell className="border border-gray-300 p-2">{selectedBooking?.SingleGroupFlight?.origin}</TableCell>
                                      <TableCell className="border border-gray-300 p-2">{selectedBooking?.SingleGroupFlight?.destination}</TableCell>
                                      <TableCell className="border border-gray-300 p-2">{new Date(selectedBooking?.SingleGroupFlight?.flight_date).toLocaleDateString() || 'N/A'}</TableCell>
                                      <TableCell className="border border-gray-300 p-2">{new Date(selectedBooking?.SingleGroupFlight?.dept_time).toLocaleTimeString() || 'N/A'}</TableCell>
                                      <TableCell className="border border-gray-300 p-2">{new Date(selectedBooking?.SingleGroupFlight?.arrival_time).toLocaleTimeString() || 'N/A'}</TableCell>
                                    </TableRow>
                                    {selectedBooking?.FlightSector?.type === 'two-way' && (
                                      <TableRow>
                                        <TableCell className="border border-gray-300 p-2">{selectedBooking?.SingleGroupFlight?.flight_number2 || 'N/A'}</TableCell>
                                        <TableCell className="border border-gray-300 p-2">{selectedBooking?.SingleGroupFlight?.origin2}</TableCell>
                                        <TableCell className="border border-gray-300 p-2">{selectedBooking?.SingleGroupFlight?.destination2}</TableCell>
                                        <TableCell className="border border-gray-300 p-2">{new Date(selectedBooking?.SingleGroupFlight?.flight_date2).toLocaleDateString() || 'N/A'}</TableCell>
                                        <TableCell className="border border-gray-300 p-2">{new Date(selectedBooking?.SingleGroupFlight?.dept_time2).toLocaleTimeString() || 'N/A'}</TableCell>
                                        <TableCell className="border border-gray-300 p-2">{new Date(selectedBooking?.SingleGroupFlight?.arrival_time2).toLocaleTimeString() || 'N/A'}</TableCell>
                                      </TableRow>
                                    )}
                                  </>
                                )}
                              </TableBody>
                            </Table>
                            <p><strong>Flight Type:</strong> {selectedBooking?.FlightSector?.type}</p>
                            <p><strong>Status:</strong> {selectedBooking?.status}</p>
                            <p><strong>Fare:</strong> {selectedBooking?.price}</p>
                            <div>
                              <strong>Passengers:</strong>
                              <Table>
                                <TableHeader>
                                  <TableRow>
                                    <TableHead>No.</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Type</TableHead>
                                    <TableHead>Passport Id</TableHead>
                                    <TableHead>DOB</TableHead>
                                    <TableHead>DOE</TableHead>
                                  </TableRow>
                                </TableHeader>
                                <TableBody>
                                  {selectedBooking?.GroupPassengers?.map((p, index) => (
                                    <TableRow key={p.id}>
                                      <TableCell>{index + 1}</TableCell>
                                      <TableCell>{p.title + " " + p.givenname + " " + p.surname || 'N/A'}</TableCell>
                                      <TableCell>{p.type || 'N/A'}</TableCell>
                                      <TableCell>{p.passportid}</TableCell>
                                      <TableCell>{p.dob}</TableCell>
                                      <TableCell>{p.doe}</TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </div>

                            <div className="mt-4">
                              {selectedBooking?.attachment ? (
                                <div>
                                  <h2 className='text-xl font-bold'>Attachment</h2>
                                  <img src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${selectedBooking?.attachment}`} alt="Booking Attachment" />
                                </div>
                              ) : (
                                <div key='image' className='relative'>
                                  <label htmlFor='image' className="block text-sm font-medium">
                                    Attachment
                                  </label>
                                  <Input
                                    type='file'
                                    name='image'
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    disabled={loadingAction === 'image'}
                                  />
                                  {loadingAction === 'image' && <Loader2 className="h-5 w-5 animate-spin absolute right-2 top-8" />}
                                </div>
                              )}
                              
                              {selectedBooking?.status === 'Pending' && (
                                <div className="flex justify-end space-x-4 mt-4">
                                  <Button
                                    onClick={() => handleAction(selectedBooking?.id, 'Approved')}
                                    className="bg-green-500 hover:bg-green-600"
                                    disabled={loadingAction === 'image' || loadingAction === 'Approved'}
                                  >
                                    {loadingAction === 'Approved' ? <Loader className='animate-spin'/> :<> <CheckCircle className="mr-2 h-4 w-4" />
                                    Approve</>}
                                   
                                  </Button>
                                  <Button
                                    onClick={() => handleAction(selectedBooking?.id, 'Rejected')}
                                    className="bg-red-500 hover:bg-red-600"
                                    disabled={loadingAction === 'image' || loadingAction === 'Rejected'}
                                  >
                                     {loadingAction === 'Rejected' ? <Loader className='animate-spin'/> :<> <XCircle className="mr-2 h-4 w-4" />
                                      Reject</>}
                                   
                                   
                                  </Button>
                                </div>
                              )}
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

