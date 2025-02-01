'use client';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { Loader } from 'lucide-react';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { EyeIcon } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';
import { useSelector } from 'react-redux';

export default function AllBookings() {
  const userid = useSelector((state) => state.user.id);
  const [bookings, setBookings] = useState([]);
  const [groupFlightBookings, setGroupFlightBookings] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [filteredGroupBookings, setFilteredGroupBookings] = useState([]);
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const flightResponse = await fetch(`/api/user/fetchflightbookingofuser/${userid}`);
        if (!flightResponse.ok) throw new Error('Failed to fetch flight bookings.');
        const flightBookings = await flightResponse.json();
        setBookings(flightBookings);
        setFilteredBookings(flightBookings);

        const groupResponse = await fetch(`/api/user/fetchgroupflightbookingofuser/${userid}`);
        if (!groupResponse.ok) throw new Error('Failed to fetch group flight bookings.');
        const groupBookings = await groupResponse.json();
        setGroupFlightBookings(groupBookings);
        setFilteredGroupBookings(groupBookings);
      } catch (error) {
        toast.error(error.message || 'Error fetching bookings.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, [userid]);

  const filterByDate = () => {
    if (!date1 || !date2) {
      toast.error('Please select both start and end dates.');
      return;
    }

    const start = new Date(date1);
    const end = new Date(date2);

    const filteredFlights = bookings.filter((entry) => {
      const entryDate = new Date(entry.FlightDetails?.flight_date);
      return entryDate >= start && entryDate <= end;
    });

    const filteredGroupFlights = groupFlightBookings.filter((entry) => {
      const entryDate = new Date(entry.SingleGroupFlight?.flight_date);
      return entryDate >= start && entryDate <= end;
    });

    setFilteredBookings(filteredFlights);
    setFilteredGroupBookings(filteredGroupFlights);

    if (filteredFlights.length === 0 && filteredGroupFlights.length === 0) {
      toast.info('No entries found for the selected date range.');
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredBookings(bookings);
      setFilteredGroupBookings(groupFlightBookings);
      return;
    }

    const filteredFlights = bookings.filter((entry) =>
      entry.FlightDetails?.airline.toLowerCase().includes(query) ||
      entry.Users?.name.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query)
    );

    const filteredGroupFlights = groupFlightBookings.filter((entry) =>
      entry.FlightAirline?.name?.toLowerCase().includes(query) ||
      entry.Users?.name.toLowerCase().includes(query) ||
      entry.status.toLowerCase().includes(query)
    );

    setFilteredBookings(filteredFlights);
    setFilteredGroupBookings(filteredGroupFlights);
  };

  return (
    <div className="mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
      <ToastContainer />
      <h2 className="text-2xl font-bold mb-6 text-center">My Bookings</h2>

      {loading ? (
        <div className="flex justify-center items-center">
          <Loader className="animate-spin w-10 h-10 text-gray-600" />
        </div>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <Input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search..."
              className="w-1/3"
            />
            <div className="flex space-x-4">
              <Input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
              />
              <Input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
              />
              <Button onClick={filterByDate}>Filter</Button>
            </div>
          </div>

          {/* Flight Bookings */}
          <section>
            <h3 className="text-xl font-semibold mb-4">Flight Bookings</h3>
            {filteredBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Airline</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBookings.map((booking, index) => (
                    <TableRow key={booking.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{booking.Users?.name || 'N/A'}</TableCell>
                      <TableCell>{booking.FlightDetails?.airline || 'N/A'}</TableCell>
                      <TableCell>{booking.FlightDetails?.fare}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center">No flight bookings found.</p>
            )}
          </section>

          {/* Group Flight Bookings */}
          <section className="mt-8">
            <h3 className="text-xl font-semibold mb-4">Group Flight Bookings</h3>
            {filteredGroupBookings.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No.</TableHead>
                    <TableHead>Agent Name</TableHead>
                    <TableHead>Airline</TableHead>
                    <TableHead>Fare</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredGroupBookings.map((booking, index) => (
                    <TableRow key={booking.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>{booking.Users?.name || 'N/A'}</TableCell>
                      <TableCell>{booking.FlightAirline?.name || 'N/A'}</TableCell>
                      <TableCell>{booking.price}</TableCell>
                      <TableCell>{booking.status}</TableCell>
                      <TableCell>
                      <Dialog open={dialogOpen} onOpenChange={setDialogOpen} >
                          <DialogTrigger asChild>
                            <Button variant="ghost">
                              <EyeIcon className="h-5 w-5 text-blue-600" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="max-w-3xl p-6 bg-white rounded-md border shadow-lg max-h-[90vh] overflow-auto">
                            <DialogTitle className="text-xl font-bold mb-4">Flight Details</DialogTitle>
                            <DialogDescription className="text-sm mb-4">
                              Here are the details for this flight booking.
                            </DialogDescription>
                            <div className="space-y-2">
                              <p><strong>Agent Name:</strong> {booking.Users?.name}  </p>
                              <p><strong>Business Name:</strong> {booking.Users?.bname} </p>
                              <p><strong>Airline:</strong> {booking.FlightAirline?.name}</p>
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
                                  {booking && (
                                    <>
                                      <TableRow>
                                        <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.flight_number || 'N/A'}
                                        </TableCell>
                                        <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.origin}
                                        </TableCell>
                                        <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.destination}
                                        </TableCell>
                                        <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.flight_date).toLocaleDateString() || 'N/A'}</TableCell>
                                        <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.dept_time).toLocaleTimeString() || 'N/A'}</TableCell>
                                        <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.arrival_time).toLocaleTimeString() || 'N/A'}</TableCell>
                                      </TableRow>
                                      {booking.FlightSector?.type === 'two-way' && (
                                        <TableRow>
                                          <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.flight_number2 || 'N/A'}
                                          </TableCell>
                                          <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.origin2}
                                          </TableCell>
                                          <TableCell className="border border-gray-300 p-2"> {booking.SingleGroupFlight?.destination2}
                                          </TableCell>
                                          <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.flight_date2).toLocaleDateString() || 'N/A'}</TableCell>
                                          <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.dept_time2).toLocaleTimeString() || 'N/A'}</TableCell>
                                          <TableCell className="border border-gray-300 p-2"> {new Date(booking.SingleGroupFlight?.arrival_time2).toLocaleTimeString() || 'N/A'}</TableCell>
                                        </TableRow>
                                      )}
                                    </>
                                  )}

                                </TableBody>
                              </Table>
                              <p><strong>Flight Type:</strong> {booking.FlightSector?.type}</p>
                              <p><strong>Status:</strong> {booking.status}</p>
                              <p><strong>Fare:</strong> {booking.price}</p>
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
                                    {booking.GroupPassengers?.map((p, index) => (
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
                                {/* {p.title} {p.givenname} {p.surname} ({p.type}) */}

                              </div>

                              <div className="mt-4">
                                {booking.attachment &&
                                  <div>
                                    <h2 className='text-xl font-bold'>Attachment</h2>
                                    <img src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${booking.attachment}`}></img>
                                  </div>
                                }

                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <p className="text-center">No group flight bookings found.</p>
            )}
          </section>
        </>
      )}
    </div>
  );
}

