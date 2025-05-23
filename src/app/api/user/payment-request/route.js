import { NextResponse } from 'next/server';
import prisma from '@/utils/prisma';

export async function POST(request) {
  try {
    const body = await request.json();
    const {  userid, transactionno, amount, img_url, status } = body;

    // Validate required fields
    if (!userid || !transactionno || !amount || !img_url || !status) {
      return NextResponse.json(
        { message: 'Missing required fields', status: false },
        { status: 400 }
      );
    }

    // Ensure amount is a valid number
    const numericAmount = parseFloat(amount);
    if (isNaN(numericAmount)) {
      return NextResponse.json(
        { message: 'Invalid amount value', status: false },
        { status: 400 }
      );
    }

    // Create a new visa in the database
    const newvisa = await prisma.paymentRequests.create({
      data: {
        userid, transactionno, img_url: img_url,
        amount: numericAmount,
        status,
        created_at: new Date(),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(newvisa);
  } catch (error) {
    console.error('Error creating visa:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to create visa',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// GET request to fetch all visa
export async function GET() {
  try {
    const visa = await prisma.paymentRequests.findMany();
    return NextResponse.json(visa);
  } catch (error) {
    console.error('Error fetching visa:', error.message);
    return NextResponse.json(
      {
        message: 'Failed to fetch visa',
        status: false,
        error: error.message,
      },
      { status: 500 }
    );
  }
}
