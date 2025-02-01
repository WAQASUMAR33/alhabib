import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

// POST: Create a new SingleGroupFlight or multiple flights for "two-way"
export async function POST(request) {
  try {
    const body = await request.json();
    console.log("Payload is ", body);
    const {  flight_number,
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
      flightairline_id,meal } = body.flights;
      
      
    const createdFlights = await
      prisma.SingleGroupFlight.create({
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
      })


    return NextResponse.json(createdFlights);
  } catch (error) {
    console.error('Error creating single group flights:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to create single group flights',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT: Update a single group flight


// GET: Fetch all SingleGroupFlights with FlightGroups
export async function GET() {
  try {
    const flights = await prisma.SingleGroupFlight.findMany({
      include: {
        FlightGroups: true,
        FlightSector: true,
        FlightAirline: true,
      },
    });

    return NextResponse.json(flights);
  } catch (error) {
    console.error('Error fetching single group flights:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch single group flights',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

