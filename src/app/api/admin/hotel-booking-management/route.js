import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    console.log('Payload is:', body);
    const { agent_id, hotel_id, remarks, totalprice, roomtype, price, check_in_date, check_out, rooms, adults, childs, infants, passengers } = body;

    // Validate required fields
    if (!agent_id || !hotel_id || !totalprice || !check_in_date || !check_out || !rooms || !roomtype) {
      return NextResponse.json(
        { message: 'Missing required fields', status: false },
        { status: 400 }
      );
    }

    console.log('Validation passed.');

    const newBooking = await prisma.HotelBooking.create({
      data: {
        agent_id: parseInt(agent_id),
        hotel_id: parseInt(hotel_id),
        check_in_date: new Date(check_in_date),
        check_out: new Date(check_out),
        roomtype: parseInt(roomtype),
        rooms: parseInt(rooms),
        adults: parseInt(adults),
        infants: parseInt(infants),
        childs: parseInt(childs),
        price: parseInt(totalprice),
        remarks: remarks,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    const passengerPromises = passengers.map((passenger) =>
      prisma.Hoteliers.create({
        data: {
          hotel_booking_id: newBooking.id,
          givenname: passenger.givenName,
          surname: passenger.surname,
          title: passenger.title,
          type: passenger.type || 'Adult',
          passportid: passenger.passport,
          dob: passenger.dob,
          doe: passenger.doe,
        },
      })
    );

    await Promise.all(passengerPromises);

    return NextResponse.json(
      { message: 'Hotel Booking and passengers added successfully.', status: true },
      { status: 201 }
    );
  } catch (error) {
    if (error.code === 'P2003') {
      // Foreign key constraint failed
      const field = error.meta.field_name; // Prisma provides meta information
      return NextResponse.json(
        {
          message: `Foreign key constraint failed on field: ${field}`,
          status: false,
        },
        { status: 400 }
      );
    }

    console.error('Error creating hotel booking:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to create hotel booking',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET request to fetch all hotel bookings
export async function GET() {
  try {
    const hotelBookings = await prisma.HotelBooking.findMany({
      include: {
        Hotel: {
          include:{
            HotelDetails:true
          }
        },
        Hoteliers: true,
        Users: true,
        RoomType: true,
      },
    });

    return NextResponse.json(hotelBookings, { status: 200 });
  } catch (error) {
    console.error('Error fetching hotel bookings:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch hotel bookings',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
