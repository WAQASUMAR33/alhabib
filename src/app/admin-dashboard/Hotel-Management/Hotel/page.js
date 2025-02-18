'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PencilIcon, TrashIcon, PlusIcon, Loader, XIcon } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

export default function HotelManagement() {
  const [hotels, setHotels] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentHotel, setCurrentHotel] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [roomTypes, setRoomTypes] = useState([]);
  const [selectedRoomTypes, setSelectedRoomTypes] = useState([]);

  useEffect(() => {
    fetchHotels()
      .then(setHotels)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));

    fetchRoomTypes()
      .then(setRoomTypes)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (currentHotel) {
      setSelectedRoomTypes(
        currentHotel.HotelDetails?.map((detail) => ({
          roomTypeId: detail.roomtype_id,
          price: detail.price,
        })) || []
      );
    } else {
      setSelectedRoomTypes([]);
    }
  }, [currentHotel]);

  const handleAddRoomType = (e) => {
    const roomTypeId = parseInt(e.target.value);
    if (roomTypeId && !selectedRoomTypes.find(rt => rt.roomTypeId === roomTypeId)) {
      setSelectedRoomTypes([...selectedRoomTypes, { roomTypeId, price: 0 }]);
    }
    e.target.value = '';
  };

  const handleRemoveRoomType = (roomTypeId) => {
    setSelectedRoomTypes(selectedRoomTypes.filter(rt => rt.roomTypeId !== roomTypeId));
  };

  const handlePriceChange = (roomTypeId, price) => {
    setSelectedRoomTypes(
      selectedRoomTypes.map(rt =>
        rt.roomTypeId === roomTypeId ? { ...rt, price: parseInt(price) || 0 } : rt
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const hotelData = {
      name: formData.get('name'),
      description: formData.get('description'),
      location: formData.get('location'),
      availability: formData.get('availability') === 'true',
      hotelDetails: selectedRoomTypes.map(rt => ({
        roomtype_id: rt.roomTypeId,
        price: rt.price
      }))
    };
    
    setLoadingAction('form');

    try {
      if (currentHotel) {
        await updateHotel({ ...currentHotel, ...hotelData });
        toast.success('Hotel updated successfully');
      } else {
        await addHotel(hotelData);
        toast.success('Hotel added successfully');
      }
      const updatedHotels = await fetchHotels();
      setHotels(updatedHotels);
      setIsModalOpen(false);
      setCurrentHotel(null);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  const fetchHotels = async () => {
    const response = await fetch('/api/admin/hotel-management');
    if (!response.ok) {
      throw new Error('Failed to fetch hotels');
    }
    return response.json();
  };

  const fetchRoomTypes = async () => {
    const response = await fetch('/api/admin/room-type-management');
    if (!response.ok) {
      throw new Error('Failed to fetch room types');
    }
    return response.json();
  };

  const addHotel = async (hotel) => {
    const response = await fetch('/api/admin/hotel-management', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hotel),
    });
    if (!response.ok) {
      throw new Error('Failed to add hotel');
    }
    return response.json();
  };

  const updateHotel = async (hotel) => {
    const response = await fetch(`/api/admin/hotel-management/${hotel.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hotel),
    });
    if (!response.ok) {
      throw new Error('Failed to update hotel');
    }
    return response.json();
  };

  const deleteHotel = async (id) => {
    const response = await fetch(`/api/admin/hotel-management/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete hotel');
    }
    return true;
  };

  const handleDeleteHotel = async (id) => {
    setLoadingAction(id);
    try {
      await deleteHotel(id);
      toast.success("Hotel deleted successfully!");
      const updatedHotels = await fetchHotels();
      setHotels(updatedHotels);
    } catch (error) {
      toast.error("Failed to delete hotel");
    } finally {
      setLoadingAction(null);
    }
  };

  const handleUpdateHotel = (hotel) => {
    setCurrentHotel(hotel);
    setIsModalOpen(true);
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Input
            type="text"
            placeholder="Search hotels..."
            className="pl-10 w-auto"
          />
          <Dialog open={isModalOpen} onOpenChange={(open) => {
            setIsModalOpen(open);
            if (!open) setCurrentHotel(null);
          }}>
            <DialogTrigger asChild>
              <Button className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Hotel
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[600px] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{currentHotel ? 'Update Hotel' : 'Add Hotel'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['name', 'description', 'location'].map((field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-sm font-medium">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Input
                        type="text"
                        name={field}
                        defaultValue={currentHotel?.[field] || ''}
                      />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="availability" className="block text-sm font-medium">
                      Availability
                    </label>
                    <select
                      name="availability"
                      defaultValue={currentHotel?.availability.toString() || 'true'}
                      className="w-full border p-2 rounded-md"
                    >
                      <option value="true">Available</option>
                      <option value="false">Unavailable</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6">
                  <label className="block text-sm font-medium mb-2">
                    Room Types and Prices
                  </label>
                  <div className="flex gap-4 mb-4">
                    <select
                      onChange={handleAddRoomType}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Add Room Type</option>
                      {roomTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                          {type.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {selectedRoomTypes.length > 0 && (
                    <div className="space-y-3">
                      {selectedRoomTypes.map((rt) => {
                        const roomType = roomTypes.find(t => t.id === rt.roomTypeId);
                        return (
                          <div key={rt.roomTypeId} className="flex items-center gap-4">
                            <div className="flex-1">
                              <span className="text-sm font-medium">{roomType?.title}</span>
                            </div>
                            <Input
                              type="number"
                              value={rt.price}
                              onChange={(e) => handlePriceChange(rt.roomTypeId, e.target.value)}
                              placeholder="Price"
                              className="w-32"
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              onClick={() => handleRemoveRoomType(rt.roomTypeId)}
                            >
                              <XIcon className="h-4 w-4" />
                            </Button>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                <Button type="submit" className="w-full mt-6" disabled={loadingAction === 'form'}>
                  {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                  {currentHotel ? 'Update' : 'Add'} Hotel
                </Button>
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
                  <TableHead>Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Room Types</TableHead>
                  <TableHead>Availability</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hotels?.map((hotel, index) => (
                  <TableRow key={hotel.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{hotel.name}</TableCell>
                    <TableCell>{hotel.description}</TableCell>
                    <TableCell>{hotel.location}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        {hotel.HotelDetails?.map((detail) => {
                          const roomType = roomTypes.find(t => t.id === detail.roomtype_id);
                          return (
                            <div key={detail.id} className="text-sm">
                              {roomType?.title}: {detail.price} Rs/-
                            </div>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>{hotel.availability ? 'Available' : 'Unavailable'}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleUpdateHotel(hotel)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteHotel(hotel.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === hotel.id}
                      >
                        {loadingAction === hotel.id ? (
                          <Loader className="h-4 w-4 animate-spin" />
                        ) : (
                          <TrashIcon className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}

