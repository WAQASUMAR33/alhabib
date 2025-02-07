'use client';


import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Eye, Loader } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import html2canvas from 'html2canvas';
import { Label } from '@radix-ui/react-label';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectContent, SelectValue, SelectItem } from '@/components/ui/select';
// Fetch Ledger Entries from API
const fetchLedgerEntries = async () => {

  const response = await fetch('/api/admin/ledger');
  if (!response.ok) {
    throw new Error('Failed to fetch ledger entries');
  }
  return response.json();
};

const LedgerManagement = () => {
  const [dialogMode, setDialogMode] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [ledgerEntries, setLedgerEntries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showManualEntryDialog, setShowManualEntryDialog] = useState(false)
  const [extra, setextra] = useState(false)
  const [filteredEntries, setFilteredEntries] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [date1, setDate1] = useState('');
  const [date2, setDate2] = useState('');
  const [manualEntry, setManualEntry] = useState({
    agent_id: 8,
    description: '',
    amount_in: 0,
    amount_out: 0,
    type: '',
    balance: '',
  })

  useEffect(() => {
    fetchLedgerEntries()
      .then((entries) => {
        setLedgerEntries(entries);
        setFilteredEntries(entries);
      })
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, [extra]);

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query)
    if (query.trim() === '') {
      setFilteredEntries(ledgerEntries)
    }
    const filtered = ledgerEntries.filter((entry) =>
      entry.Users?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.type.toLowerCase().includes(searchQuery.toLowerCase())
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
      // Capture the screenshot of the specified element
      const canvas = await html2canvas(printArea, { useCORS: true });

      // Convert the canvas to an image
      const imageData = canvas.toDataURL('image/png');

      // Open a new window for printing
      const printWindow = window.open('', '', 'width=800,height=600');

      if (printWindow) {
        printWindow.document.write('<html><head><title>Print</title></head><body style="margin:0; display:flex; justify-content:center; align-items:center;">');
        printWindow.document.write(`<img src="${imageData}" style="max-width:100%; max-height:100vh;" onload="window.print(); window.close();"/>`);
        printWindow.document.write('</body></html>');
        printWindow.document.close();

        // Add a fallback in case the image load event fails
        setTimeout(() => {
          if (printWindow) {
            printWindow.print();
            printWindow.close();
          }
        }, 3000); // 3-second fallback
      }
    } catch (error) {
      console.error('Failed to capture screenshot for printing:', error);
    }
  };
  const AddManualEntry = async (entry) => {
    const response = await fetch('/api/admin/ledger/manual-entry', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(entry),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add manual entry');
    }
    return response.json();
  };

  const handleManualEntrySubmit = async (e) => {
    e.preventDefault();

    try {
      const result = await AddManualEntry(manualEntry);
      toast.success('Manual entry added successfully!');
      console.log('Manual entry submitted:', result);
      setextra(!extra);
    } catch (error) {
      toast.error(error.message || 'An error occurred while adding manual entry');
      console.error('Error:', error);
    }

    setShowManualEntryDialog(false);
    setManualEntry({
      agent_id: 8,
      description: '',
      amount_in: 0,
      amount_out: 0,
      type: '',
      balance: '',
    });
  };
  // Calculate total debit and credit
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



  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className='flex justify-between w-full'>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => handleSearch(e)}
            placeholder="Search..."
            className="border border-gray-300 rounded-lg px-4 h-10 w-auto"
          />

          <div className="flex space-x-4 mb-4">
            <input
              type="date"
              value={date1}
              onChange={(e) => setDate1(e.target.value)}
              className="border border-gray-300 rounded-lg px-4 py-1"
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

          {/* <Button onClick={() => setShowManualEntryDialog(true)} className="mb-4">
            Add Manual Entry
          </Button> */}

          <Dialog open={showManualEntryDialog} onOpenChange={setShowManualEntryDialog}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Manual Ledger Entry</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleManualEntrySubmit}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="agent_id" className="text-right">
                      Agent ID
                    </Label>
                    <Input
                      id="agent_id"
                      value={manualEntry.agent_id}
                      disabled
                      onChange={(e) =>
                        setManualEntry({ ...manualEntry, agent_id: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="description" className="text-right">
                      Description
                    </Label>
                    <Input
                      id="description"
                      value={manualEntry.description}
                      onChange={(e) =>
                        setManualEntry({ ...manualEntry, description: e.target.value })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount_in" className="text-right">
                      Amount In
                    </Label>
                    <Input
                      id="amount_in"
                      type="number"
                      value={manualEntry.amount_in}
                      onChange={(e) =>
                        setManualEntry({
                          ...manualEntry,
                          amount_in: parseFloat(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>

                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="amount_out" className="text-right">
                      Amount Out
                    </Label>
                    <Input
                      id="amount_out"
                      type="number"
                      value={manualEntry.amount_out}
                      onChange={(e) =>
                        setManualEntry({
                          ...manualEntry,
                          amount_out: parseFloat(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="balance" className="text-right">
                      Balance
                    </Label>
                    <Input
                      id="balance"
                      type="number"
                      value={manualEntry.balance}
                      onChange={(e) =>
                        setManualEntry({
                          ...manualEntry,
                          balance: parseFloat(e.target.value),
                        })
                      }
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="type" className="text-right">
                      Type
                    </Label>
                    <Select
                      onValueChange={(value) =>
                        setManualEntry({ ...manualEntry, type: value })
                      }
                    >
                      <SelectTrigger className="col-span-3">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hotel-booking">Hotel Booking</SelectItem>
                        <SelectItem value="flight-booking">Flight Booking</SelectItem>
                        <SelectItem value="group-flight-booking">
                          Group Flight Booking
                        </SelectItem>
                        <SelectItem value="payment-request">
                          Payment Request
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Add Entry</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
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
                        <TableCell>{selectedEntry.HotelBooking?.price}</TableCell>
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
                        <TableHead>Flight Number</TableHead>
                        <TableHead>Note</TableHead>
                        {/* <TableHead>DOE</TableHead> */}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedEntry.HotelBooking?.Hoteliers?.map((Hotelier, index) => (
                        <TableRow key={index}>
                          <TableCell>{Hotelier.title} {Hotelier.givenname} {Hotelier.surname}</TableCell>
                          <TableCell>{Hotelier.type}</TableCell>
                          <TableCell>{Hotelier.passportid}</TableCell>
                          <TableCell>{Hotelier.flight_number}</TableCell>
                          <TableCell>{Hotelier.dob}</TableCell>
                          {/* <TableCell>{Hotelier.doe}</TableCell> */}
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
              <div className='w-full '>
                <img src={`${selectedEntry?.PaymentRequests?.img_url}`} className='h-full'></img>
              </div>
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
                {selectedEntry.type === 'group-flight-booking' && (
                  <div className='w-full '>
                    <img src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${selectedEntry?.GroupFlightBookings?.attachment}`} alt='attachment' className='h-[60vh]'></img>
                  </div>
                )}
              </div>
              {/* </DialogContent> */}
              {selectedEntry.type === 'payment-request' && (
                <div className='w-full '>
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

        </DialogContent>
      </Dialog>
    </div>

  );
}

export default LedgerManagement;