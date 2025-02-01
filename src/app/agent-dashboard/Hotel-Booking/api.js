export const fetchHotellocations = async () => {
  const response = await fetch(`/api/user/getlocations`);
  if (!response.ok) {
    throw new Error('Failed to fetch hotel locations');
  }
  return response.json();
};


export const fetchHotelBookings = async (id) => {
    const response = await fetch(`/api/user/fetchhotelbookingofuser/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch hotel bookings');
    }
    return response.json();
  };
  
  export const fetchHotel = async () => {
    const response = await fetch('/api/admin/hotel-management');
    if (!response.ok) {
      throw new Error('Failed to fetch hotel');
    }
    return response.json();
  };
  
  export const addHotelBooking = async (booking) => {
    const response = await fetch('/api/admin/hotel-booking-management', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!response.ok) {
      throw new Error('Failed to add hotel booking');
    }
    return response.json();
  };
  export const updateHotelBooking = async (booking) => {
    const response = await fetch(`/api/admin/hotel-booking-management/${booking.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
    });
    if (!response.ok) {
      throw new Error('Failed to update hotel booking');
    }
    return response.json();
  };
  
  export const deleteHotelBooking = async (id) => {
    const response = await fetch(`/api/admin/hotel-booking-management/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete hotel booking');
    }
    return true;
  };
  
  