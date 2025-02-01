'use client';

import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Loader } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { useSelector } from 'react-redux';

const fetchLedgerEntries = async (id) => {

  const response = await fetch(`/api/user/ledger/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch ledger entries');
  }
  return response.json();
};

const LedgerManagement = forwardRef(({ date1, date2 }, ref) => {
  const [dialogMode, setDialogMode] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const userid = useSelector((data) => data.user.id)

  useEffect(() => {
    fetchLedgerEntries(userid)
      .then((entries) => {
        setLedgerEntries(entries);
        setFilteredEntries(entries);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.trim() === '') {
      setFilteredEntries(ledgerEntries);
      return;
    }
    const filtered = ledgerEntries.filter((entry) =>
      entry.Users?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.type?.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredEntries(filtered);
  };

  useEffect(() => {
    console.log("Selected Entry", selectedEntry)
  }, [selectedEntry])

  const printDialogContent = async () => {
    const printArea = document.getElementById('print-section');

    if (!printArea) {
      console.error('Print section not found');
      return;
    }

    try {
      const canvas = await html2canvas(printArea, { useCORS: true });

      const imageData = canvas.toDataURL('image/png');

      const printWindow = window.open('', '', 'width=800,height=600');

      if (printWindow) {
        printWindow.document.write('<html><head><title>Print</title></head><body style="margin:0; display:flex; justify-content:center; align-items:center;">');
        printWindow.document.write(`<img src="${imageData}" style="max-width:100%; max-height:100vh;" onload="window.print(); window.close();"/>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        setTimeout(() => {
          if (printWindow) {
            printWindow.print();
            printWindow.close();
          }
        }, 3000);
      }
    } catch (error) {
      console.error('Failed to capture screenshot for printing:', error);
    }
  };


  const totalDebit = ledgerEntries.reduce((total, entry) => total + entry.amount_in, 0);
  const totalCredit = ledgerEntries.reduce((total, entry) => total + entry.amount_out, 0);


  const filterByDate = () => {
    if (!date1 || !date2) {
      toast.error('Please select both start and end dates.');
      return;
    }

    const start = new Date(date1);
    const end = new Date(date2);

    const filtered = ledgerEntries.filter((entry) => {
      const entryDate = new Date(entry.date);
      return entryDate >= start && entryDate <= end;
    });

    setFilteredEntries(filtered);

    if (filtered.length === 0) {
      toast.info('No entries found for the selected date range.');
    }
  };
  useImperativeHandle(ref, () => ({
    filterByDate,
  }));
  return (
    <div className='relative'>
      <ToastContainer />
      <div className="flex absolute -top-[60px] left-4 items-center gap-4 mb-4">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => handleSearch(e)}
          placeholder="Search..."
          className="border border-gray-300 rounded-lg px-4 py-2 w-auto"
        />

      </div>
      <div className="p-0">
        {isLoading ? (
          <div className="flex justify-center">
            <Loader className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>No.</TableHead>
                  {/* <TableHead>User ID</TableHead> */}
                  <TableHead>Agent Name</TableHead>
                  <TableHead>Booking Type</TableHead>
                  <TableHead>Passengers</TableHead>
                  <TableHead>Amount In</TableHead>
                  <TableHead>Amount Out</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Transaction Date</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody >
                {filteredEntries.map((entry, index) => (
                  <TableRow key={entry.id}>
                    <TableCell>{index + 1}</TableCell>
                    {/* <TableCell>{entry.agent_id}</TableCell> */}
                    <TableCell>{entry.Users?.name}</TableCell>
                    <TableCell>{entry.type}</TableCell>
                    <TableCell>

                      {entry.type === 'hotel-booking' && (
                        <>
                          <ul>
                            {entry.HotelBooking?.Hoteliers?.map((passenger, index) => (
                              <li key={index}>{passenger.title} {passenger.givenname} {passenger.surname}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      {entry.type === 'flight-booking' && (
                        <>
                          -
                        </>
                      )}
                      {entry.type === 'group-flight-booking' && (
                        <>
                          <ul>
                            {entry.GroupFlightBookings?.GroupPassengers?.map((passenger, index) => (
                              <li key={index}>{passenger.title} {passenger.givenname} {passenger.surname}</li>
                            ))}
                          </ul>
                        </>
                      )}
                      {entry.type === 'payment-request' && (
                        <>
                          -
                        </>
                      )}
                      {entry.type === 'package-booking' && (
                        <>
                          -
                        </>
                      )}
                    </TableCell>
                    <TableCell>{entry.amount_in}</TableCell>
                    <TableCell>{entry.amount_out}</TableCell>
                    <TableCell>{entry.balance}</TableCell>
                    <TableCell>{entry.description}</TableCell>
                    <TableCell>{new Date(entry.date).toLocaleString()}</TableCell>
                    {entry.type === 'package-booking' ? '' : <TableCell><Button
                      onClick={() => {
                        setSelectedEntry(entry);
                        setDialogMode(true);
                      }}
                      variant="ghost"
                      className="text-indigo-600"
                    >
                      <Eye className="h-4 w-4" />
                    </Button></TableCell>}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Total Debit and Credit */}
            <div className="mt-4 flex justify-between items-center">
              <div className="text-lg font-medium">Total Debit: {totalDebit.toFixed(2)}</div>
              <div className="text-lg font-medium">Total Credit: {totalCredit.toFixed(2)}</div>
            </div>
          </div>
        )}
      </div>

      <Dialog open={dialogMode} onOpenChange={setDialogMode}>
        <DialogContent className="max-w-4xl">
          {selectedEntry?.type === 'hotel-booking' && (<>
            <DialogHeader>
              <DialogTitle>
                <p className='capitalize'>{selectedEntry?.type}</p>
              </DialogTitle>
            </DialogHeader>
            <div id="print-section" className=' w-full flex'>
              <div className='flex flex-col w-full'>
                <div className='mt-2'>
                  <h2 className='text-xl font-bold'>Hotel Booking Details</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Hotel</TableHead>
                        <TableHead>Agent</TableHead>
                        <TableHead>Room</TableHead>
                        <TableHead>Adults</TableHead>
                        <TableHead>Children</TableHead>
                        <TableHead>Infants</TableHead>
                        <TableHead>Check-In</TableHead>
                        <TableHead>Check-Out</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{selectedEntry.HotelBooking?.Hotel?.name}</TableCell>
                        <TableCell>{selectedEntry.HotelBooking?.Users?.name}</TableCell>
                        <TableCell>{selectedEntry.HotelBooking?.rooms}</TableCell>
                        <TableCell>{selectedEntry.HotelBooking?.adults}</TableCell>
                        <TableCell>{selectedEntry.HotelBooking?.childs}</TableCell>
                        <TableCell>{selectedEntry.HotelBooking?.infants}</TableCell>
                        <TableCell>{new Date(selectedEntry.HotelBooking?.check_in_date).toLocaleString()}</TableCell>
                        <TableCell>{new Date(selectedEntry.HotelBooking?.check_out).toLocaleString()}</TableCell>
                        <TableCell>{selectedEntry.HotelBooking?.Hotel?.price}</TableCell>
                        <TableCell>{selectedEntry.HotelBooking?.status}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
                <div className='mt-2'>
                  <h2 className='text-xl font-bold'>Hoteliers Details</h2>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Passport Id</TableHead>
                        <TableHead>DOB</TableHead>
                        <TableHead>DOE</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEntry.HotelBooking?.Hoteliers?.map((Hotelier, index) => (
                        <TableRow key={index}>
                          <TableCell>{Hotelier.title} {Hotelier.givenname} {Hotelier.surname}</TableCell>
                          <TableCell>{Hotelier.type}</TableCell>
                          <TableCell>{Hotelier.passportid}</TableCell>
                          <TableCell>{Hotelier.dob}</TableCell>
                          <TableCell>{Hotelier.doe}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

              </div>
            </div>
            <Button
              onClick={printDialogContent}
              className="w-40 bg-blue-500 text-white hover:bg-blue-600"
            >
              Print
            </Button>
          </>)}
          {selectedEntry?.type === 'payment-request' && (<>
            <DialogHeader>
              <DialogTitle>
                <p className='capitalize'>{selectedEntry?.type}</p>
              </DialogTitle>
            </DialogHeader>
            <div id="print-section" className=' w-full flex'>
              <div className='flex flex-col justify-between '>
                <Table className='w-80 flex'>
                  <div >
                    <TableHeader>
                      <TableRow className='bg-gray-100 hover:bg-gray-200 flex flex-col'>
                        <TableHead className="items-center flex">Agent Id</TableHead>
                        <TableHead className="items-center flex">Name</TableHead>
                        <TableHead className="items-center flex">BusinessName</TableHead>
                        <TableHead className="items-center flex">Transaction No.</TableHead>
                        <TableHead className="items-center flex">Amount</TableHead>
                        <TableHead className="items-center flex">Date</TableHead>
                      </TableRow>
                    </TableHeader>
                  </div>
                  <div>
                    <TableBody>
                      <TableRow className='flex flex-col space-y-7 px-2 py-3'>
                        <TableCell className="items-center flex p-0">
                          {selectedEntry?.agent_id}
                        </TableCell>
                        <TableCell className="items-center flex p-0">
                          {selectedEntry?.Users?.name} {selectedEntry?.Users?.last_name}
                        </TableCell>
                        <TableCell className="items-center flex p-0">
                          {selectedEntry?.Users?.bname}
                        </TableCell>
                        <TableCell className="items-center flex p-0">
                          {selectedEntry?.PaymentRequests?.transactionno}
                        </TableCell>
                        <TableCell className="items-center flex p-0">
                          {selectedEntry?.amount_in}
                        </TableCell>
                        <TableCell className="items-center flex p-0">
                          {new Date(selectedEntry?.date).toLocaleString()}
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </div>
                </Table>



              </div>
              {selectedEntry.type === 'payment-request' && (
                <div className='w-full flex justify-center items-center'>
                  <img src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${selectedEntry?.PaymentRequests?.img_url}`} className='h-[60vh]'></img>
                </div>
              )}
            </div>
            <Button
              onClick={printDialogContent}
              className="w-40 bg-blue-500 text-white hover:bg-blue-600"
            >
              Print
            </Button>
          </>)}
          {selectedEntry?.type === 'group-flight-booking' && (<>
            <DialogHeader>
              <DialogTitle>
                <p className='capitalize'>{selectedEntry?.type}</p>
              </DialogTitle>
            </DialogHeader>
            <div id="print-section" className=' w-full flex'>
              <div className="space-y-2 w-full h-[70vh] overflow-auto">
                <p><strong>Agent Name:</strong> {selectedEntry.Users?.name}  </p>
                <p><strong>Business Name:</strong> {selectedEntry.Users?.bname} </p>
                <p><strong>Airline:</strong> {selectedEntry.GroupFlightBookings?.FlightAirline?.name}</p>
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
                    {selectedEntry && (
                      <>
                        <TableRow>
                          <TableCell className="border border-gray-300 p-2"> {selectedEntry.GroupFlightBookings?.SingleGroupFlight?.flight_number || 'N/A'}
                          </TableCell>
                          <TableCell className="border border-gray-300 p-2"> {selectedEntry.GroupFlightBookings?.SingleGroupFlight?.origin}
                          </TableCell>
                          <TableCell className="border border-gray-300 p-2"> {selectedEntry.GroupFlightBookings?.SingleGroupFlight?.destination}
                          </TableCell>
                          <TableCell className="border border-gray-300 p-2"> {new Date(selectedEntry.GroupFlightBookings?.SingleGroupFlight?.flight_date).toLocaleDateString() || 'N/A'}</TableCell>
                          <TableCell className="border border-gray-300 p-2"> {new Date(selectedEntry.GroupFlightBookings?.SingleGroupFlight?.dept_time).toLocaleTimeString() || 'N/A'}</TableCell>
                          <TableCell className="border border-gray-300 p-2"> {new Date(selectedEntry.GroupFlightBookings?.SingleGroupFlight?.arrival_time).toLocaleTimeString() || 'N/A'}</TableCell>
                        </TableRow>
                        {selectedEntry.FlightSector?.type === 'two-way' && (
                          <TableRow>
                            <TableCell className="border border-gray-300 p-2"> {selectedEntry.GroupFlightBookings?.SingleGroupFlight?.flight_number2 || 'N/A'}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-2"> {selectedEntry.GroupFlightBookings?.SingleGroupFlight?.origin2}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-2"> {selectedEntry.GroupFlightBookings?.SingleGroupFlight?.destination2}
                            </TableCell>
                            <TableCell className="border border-gray-300 p-2"> {new Date(selectedEntry.GroupFlightBookings?.SingleGroupFlight?.flight_date2).toLocaleDateString() || 'N/A'}</TableCell>
                            <TableCell className="border border-gray-300 p-2"> {new Date(selectedEntry.GroupFlightBookings?.SingleGroupFlight?.dept_time2).toLocaleTimeString() || 'N/A'}</TableCell>
                            <TableCell className="border border-gray-300 p-2"> {new Date(selectedEntry.GroupFlightBookings?.SingleGroupFlight?.arrival_time2).toLocaleTimeString() || 'N/A'}</TableCell>
                          </TableRow>
                        )}
                      </>
                    )}

                  </TableBody>
                </Table>
                <p><strong>Flight Type:</strong> {selectedEntry.GroupFlightBookings?.FlightSector?.type}</p>
                <p><strong>Status:</strong> {selectedEntry.GroupFlightBookings?.status}</p>
                <p><strong>Fare:</strong> {selectedEntry.GroupFlightBookings?.price}</p>
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
                      {selectedEntry.GroupFlightBookings?.GroupPassengers?.map((p, index) => (
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
                {selectedEntry.type === 'group-flight-booking' && (<>
                  {selectedEntry.GroupFlightBookings?.attachment ? <div className='w-full '>
                    <h2 className='text-xl font-bold'>Attachment</h2>
                    <img src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${selectedEntry?.GroupFlightBookings?.attachment}`} alt='attachment' className='h-[60vh]'></img>
                  </div> : <div className='w-full '>
                    <img src='https://w0.peakpx.com/wallpaper/414/49/HD-wallpaper-car-lamborghini-aventador-black-vertical-car-vertical-cars.jpg' alt='attachment' className='h-[60vh]'></img>
                  </div>}

                </>)}
              </div>

            </div>
            <Button
              onClick={printDialogContent}
              className="w-40 bg-blue-500 text-white hover:bg-blue-600"
            >
              Print
            </Button>
          </>)}
        </DialogContent>
      </Dialog>
    </div>

  );
})

export default LedgerManagement;