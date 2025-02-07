import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Loader } from 'lucide-react';

export default function BookingDetails({ booking, onApprove, onReject, isLoading }) {
  if (!booking) return null;

  return (
    <div className='flex flex-col w-full'>
      <div className='mt-2'>
        <h2 className='text-xl font-bold'>Hotel Booking Details</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Hotel</TableHead>
              <TableHead>Agent</TableHead>
              <TableHead>Room Type</TableHead>
              {/* <TableHead>Adults</TableHead>
              <TableHead>Children</TableHead>
              <TableHead>Infants</TableHead> */}
              <TableHead>Check-In</TableHead>
              <TableHead>Check-Out</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>QTY</TableHead>
              <TableHead>Days</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell>{booking.Hotel?.name}</TableCell>
              <TableCell>{booking.Users?.name}</TableCell>
              {/* <TableCell>{booking.rooms}</TableCell> */}
              <TableCell>{booking.RoomType?.title}</TableCell>
              {/* <TableCell>{booking.adults}</TableCell>
              <TableCell>{booking.childs}</TableCell>
              <TableCell>{booking.infants}</TableCell> */}
              <TableCell>{new Date(booking.check_in_date).toLocaleDateString()}</TableCell>
              <TableCell>{new Date(booking.check_out).toLocaleDateString()}</TableCell>
              <TableCell>
                {booking.Hotel?.HotelDetails?.find((hotel) => hotel.roomtype_id === booking.roomtype)?.price ?? "Price not available"}
              </TableCell>
              <TableCell>{booking.rooms}</TableCell>
              <TableCell>
                {Math.ceil(
                  (new Date(booking.check_out).getTime() - new Date(booking.check_in_date).getTime()) /
                  (1000 * 60 * 60 * 24)
                )}{" "}
                days
              </TableCell>
              <TableCell>{booking.price}</TableCell>
              <TableCell>{booking.status}</TableCell>
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
            {booking.Hoteliers?.map((Hotelier, index) => (
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
      {/* <div className='flex gap-2 mt-4'>
        <Button onClick={onApprove} disabled={isLoading}>
          {isLoading ? <Loader className='animate-spin' /> : "Approve"}
        </Button>
        <Button onClick={onReject} disabled={isLoading}>
          {isLoading ? <Loader className='animate-spin' /> : "Reject"}
        </Button>
      </div> */}
    </div>
  );
}

