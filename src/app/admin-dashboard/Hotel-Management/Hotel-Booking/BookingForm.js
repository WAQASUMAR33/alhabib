import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@radix-ui/react-label';
import { Loader } from 'lucide-react';

export default function BookingForm({ onSubmit,location, initialData, hotels, roomTypes, isLoading }) {
  const [adults, setAdults] = useState(initialData?.adults || 0);
  const [children, setChildren] = useState(initialData?.childs || 0);
  const [infants, setInfants] = useState(initialData?.infants || 0);
  const [passengers, setPassengers] = useState(initialData?.passengers || []);
  const [fieldsVisible, setFieldsVisible] = useState(false);
  // const [price, setPrice] = useState(initialData?.price || '');
  // const [selectedRoomType, setSelectedRoomType] = useState(initialData?.roomtype || '');
  const [selectedHotel, setSelectedHotel] = useState(initialData?.hotel_id || '');
  const [filteredRoomTypes, setFilteredRoomTypes] = useState([]);
  // const [rooms, setRooms] = useState(initialData?.rooms || 1);
  const[selectedlocation, setSelectedLocation]= useState()
  const [selectedRoomType, setSelectedRoomType] = useState(initialData?.roomtype_id || '');
  const [rooms, setRooms] = useState(initialData?.rooms || 1);
  const [price, setPrice] = useState('');
  const [totalprice, settotalprice]= useState('')
  const [nights, setNights] = useState(0);

  //new code start 
  // const filteredRoomTypes = hotels
  //   .flatMap((hotel) => hotel.HotelDetails)
  //   .filter((detail) => detail.roomtype_id);


  useEffect(() => {
    if (!selectedRoomType) {
      setPrice('');
      return;
    }

    const roomTypeDetails = hotels
      .flatMap((hotel) => hotel.HotelDetails)
      .find((detail) => detail.roomtype_id === Number(selectedRoomType));

    const roomPrice = roomTypeDetails?.price || 0;
    settotalprice(roomPrice * rooms * nights); // Multiply price by the number of rooms and nights
  }, [selectedRoomType, hotels, rooms, nights]);

  const calculateNights = (checkIn, checkOut) => {
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diffTime = Math.abs(end - start);
    const diffNights = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    setNights(diffNights);
  };
  //new code ends
  // Filter room types based on the selected hotel
  useEffect(() => {
    if (!selectedHotel) {
      setFilteredRoomTypes([]);
      return;
    }

    const hotelDetails = hotels.find((hotel) => hotel.id === Number(selectedHotel))?.HotelDetails || [];
    const availableRoomTypes = roomTypes.filter((roomType) =>
      hotelDetails.some((detail) => detail.roomtype_id === roomType.id)
    );

    setFilteredRoomTypes(availableRoomTypes);
    setSelectedRoomType(''); 
  }, [selectedHotel, hotels, roomTypes]);

  
  useEffect(() => {
    if (!selectedRoomType) {
      setPrice('');
      return;
    }

    const roomTypeDetails = hotels
      .flatMap((hotel) => hotel.HotelDetails)
      .find((detail) => detail.roomtype_id === Number(selectedRoomType));

    const roomPrice = roomTypeDetails?.price || 0;
    setPrice(roomPrice ); // Multiply price by the number of rooms
  }, [selectedRoomType, hotels, rooms])

  const handleConfirm = (e) => {
    e.preventDefault();
    const newPassengers = [];

    for (let i = 0; i < adults; i++) {
      newPassengers.push({ type: "Adult", surname: "", givenName: "", title: "Mr/Mrs", passport: "", dob: "", doe: "" });
    }
    for (let i = 0; i < children; i++) {
      newPassengers.push({ type: "Child", surname: "", givenName: "", title: "CHD", passport: "", dob: "", doe: "" });
    }
    for (let i = 0; i < infants; i++) {
      newPassengers.push({ type: "Infant", surname: "", givenName: "", title: "INF", passport: "", dob: "", doe: "" });
    }

    setPassengers(newPassengers);
    setFieldsVisible(true);
  };

  const handlePassengerChange = (index, field, value) => {
    const updatedPassengers = [...passengers];
    updatedPassengers[index][field] = value;
    setPassengers(updatedPassengers);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const bookingData = Object.fromEntries(formData.entries());

    bookingData.adults = adults;
    bookingData.childs = children;
    bookingData.infants = infants;
    bookingData.passengers = passengers;

    onSubmit(bookingData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-4 mb-4">
        <div className="grid grid-cols-3 gap-4">
        <div>
            <label htmlFor="hotel_id" className="block text-sm font-medium">
              Locations
            </label>
            <select
              name="location"
              value={selectedlocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Location</option>
              {location.map((name,index) => (
                <option key={index} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="hotel_id" className="block text-sm font-medium">
              Hotel
            </label>
            <select
              name="hotel_id"
              value={selectedHotel}
              onChange={(e) => setSelectedHotel(e.target.value)}
              required
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select Hotel</option>
              {hotels.filter((item)=>item.location===selectedlocation).map((hotel) => (
                <option key={hotel.id} value={hotel.id}>
                  {hotel.name}
                </option>
              ))}
            </select>
          </div>
          <div>
        <label htmlFor="roomtype" className="block text-sm font-medium">
          Room Type
        </label>
        <select
          name="roomtype"
          value={selectedRoomType}
          onChange={(e) => setSelectedRoomType(e.target.value)}
          required
          className="w-full p-2 border border-gray-300 rounded-md"
          disabled={!filteredRoomTypes.length}
        >
          <option value="">Select Room Type</option>
          {filteredRoomTypes.map((group) => (
            <option key={group.id} value={group.id}>
              {group.title}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="priceperroom" className="block text-sm font-medium">
          Price per Room/Bed
        </label>
        <Input
          type="number"
          name="priceperroom"
          value={price||''}
          readOnly
          required
        />
      </div>
     
      <div>
        <label htmlFor="check_in_date" className="block text-sm font-medium">
          Check-in Date
        </label>
        <Input
          type="date"
          name="check_in_date"
          required
          defaultValue={initialData?.check_in_date || ''}
          onChange={(e) => calculateNights(e.target.value, document.getElementsByName('check_out')[0].value)}
        />
      </div>
      <div>
        <label htmlFor="check_out" className="block text-sm font-medium">
          Check-out Date
        </label>
        <Input
          type="date"
          name="check_out"
          required
          defaultValue={initialData?.check_out || ''}
          onChange={(e) => calculateNights(document.getElementsByName('check_in_date')[0].value, e.target.value)}
        />
      </div>
      <div>
        <label htmlFor="nights" className="block text-sm font-medium">
          Nights
        </label>
        <Input
          type="number"
          name="nights"
          value={nights}
          readOnly
          required
        />
      </div>
      <div>
        <label htmlFor="rooms" className="block text-sm font-medium">
        Room/Bed (QTY)
        </label>
        <Input
          type="number"
          name="rooms"
          value={rooms}
          onChange={(e) => setRooms(e.target.value)}
          required
        />
      </div>
          {/* <div>
            <label htmlFor="price" className="block text-sm font-medium">
              Price per Room/Bed
            </label>
            <Input
              type="number"
              name="priceperroom"
              value={selectedRoomType.price}
              readOnly
              required
            />
          </div> */}
        
          <div>
            <label htmlFor="price" className="block text-sm font-medium">
              Total Price
            </label>
            <Input
              type="number"
              name="totalprice"
              value={totalprice}
              readOnly
              required
            />
          </div>
          {['remarks'].map((field) => (
            <div key={field}>
              <label htmlFor={field} className="block text-sm font-medium">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <Input
                type={field === 'rooms' ? 'number' : 'text'}
                name={field}
                required
                defaultValue={initialData?.[field] || ''}
              />
            </div>
          ))}
        </div>
        <div>
          <div className="grid grid-cols-4 gap-4 text-xl">
            <div>
              <Label className="text-lg font-bold">Adults</Label>
              <Input
                type="number"
                value={adults}
                required
                onChange={(e) => setAdults(Number(e.target.value))}
                placeholder="0"
                className="border border-gray-600"
              />
            </div>
            <div>
              <Label className="text-lg font-bold">Children</Label>
              <Input
                type="number"
                value={children}
                required
                onChange={(e) => setChildren(Number(e.target.value))}
                placeholder="0"
                className="border border-gray-600"
              />
            </div>
            <div>
              <Label className="text-lg font-bold">Infants</Label>
              <Input
                type="number"
                value={infants}
                required
                onChange={(e) => setInfants(Number(e.target.value))}
                placeholder="0"
                className="border border-gray-600"
              />
            </div>
            <div className="flex flex-col justify-end">
              <Button type="button" onClick={handleConfirm}>Confirm</Button>
            </div>
          </div>
          {fieldsVisible && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Passenger Details</h3>
              {passengers.map((passenger, index) => (
                <div key={index}>
                  <Label className="text-lg font-bold">
                    {index + 1}. {passenger.type}
                  </Label>
                  <div className="grid grid-cols-6 gap-4 mb-4">
                    <div>
                      <Label>Surname</Label>
                      <Input
                        placeholder="Surname"
                        value={passenger.surname}
                        onChange={(e) => handlePassengerChange(index, "surname", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Given Name</Label>
                      <Input
                        placeholder="Given Name"
                        value={passenger.givenName}
                        onChange={(e) => handlePassengerChange(index, "givenName", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Title</Label>
                      <Input
                        placeholder="Title"
                        value={passenger.title}
                        disabled
                      />
                    </div>
                    <div>
                      <Label>Passport</Label>
                      <Input
                        placeholder="Passport"
                        value={passenger.passport}
                        onChange={(e) => handlePassengerChange(index, "passport", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Date of Birth (DOB)</Label>
                      <Input
                        type="date"
                        placeholder="DOB"
                        value={passenger.dob}
                        onChange={(e) => handlePassengerChange(index, "dob", e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Date of Expiry (DOE)</Label>
                      <Input
                        type="date"
                        placeholder="DOE"
                        value={passenger.doe}
                        onChange={(e) => handlePassengerChange(index, "doe", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading && <Loader className="mr-2 animate-spin" />}
        {initialData ? 'Update' : 'Add'} Booking
      </Button>
    </form>
  );
}

