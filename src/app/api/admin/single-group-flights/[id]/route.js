import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// GET: Fetch a SingleGroupFlight by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const flight = await prisma.SingleGroupFlight.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!flight) {
      return NextResponse.json(
        { message: 'Single group flight not found', status: false },
        { status: 404 }
      );
    }

    return NextResponse.json(flight);
  } catch (error) {
    console.error('Error fetching single group flight:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch single group flight',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT: Update a SingleGroupFlight by ID
export async function PUT(request, { params }) {
  const { id } = params;

  try {
    const flight = await request.json();
    console.log('id:', id);
    console.log('body:', flight);
    const {flight_number,
      origin,
      destination,
      baggage,
      seats,
      fare,
      flight_date,
      dept_time,
      arrival_time,
      flight_number2,
      origin2,
      destination2,
      flight_date2,
      dept_time2,
      arrival_time2,
      flightgroup_id,
      flightsector_id,
      flightairline_id,meal } = flight;
   

    const updatedFlight = await prisma.SingleGroupFlight.update({
      where: { id: parseInt(id) },
      data: {
        flightgroup_id: parseInt(flightgroup_id),
        flightsector_id: parseInt(flightsector_id),
        flightairline_id: parseInt(flightairline_id),
        flight_number: parseInt(flight_number),
        flight_date: new Date(flight_date),
        origin: origin,
        destination: destination,
        dept_time: new Date(dept_time),
        arrival_time: new Date(arrival_time),
        flight_number2: parseInt(flight_number2),
        flight_date2: new Date(flight_date2),
        origin2: origin2,
        destination2: destination2,
        dept_time2: new Date(dept_time2),
        arrival_time2: new Date(arrival_time2),
        baggage: baggage,
        seats: parseInt(seats),
        fare: parseInt(fare),
        created_at: new Date(),
        updated_at: new Date(),
        meal: meal? meal==='true'? true : false : false,
      },
    });

    return NextResponse.json(updatedFlight);
  } catch (error) {
    console.error('Error updating single group flight:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to update single group flight',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE: Delete a single group flight
export async function DELETE(request, { params }) {
  const { id } = params;

  try {
    await prisma.SingleGroupFlight.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({
      message: 'Single group flight deleted successfully',
      status: true,
    });
  } catch (error) {
    console.error('Error deleting single group flight:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to delete single group flight',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}