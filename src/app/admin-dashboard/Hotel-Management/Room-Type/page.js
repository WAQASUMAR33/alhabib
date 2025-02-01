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
import { PencilIcon, TrashIcon, PlusIcon, Loader } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const fetchRoomTypes = async () => {
  const response = await fetch('/api/admin/room-type-management');
  if (!response.ok) {
    throw new Error('Failed to fetch room types');
  }
  // const data = await response.json()
  // console.log("Response",data)
  return response.json();
};

const addRoomType = async (roomType) => {
  const response = await fetch('/api/admin/room-type-management', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roomType),
  });
  if (!response.ok) {
    throw new Error('Failed to add room type');
  }
  return response.json();
};

const updateRoomType = async (roomType) => {
  const response = await fetch(`/api/admin/room-type-management/${roomType.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(roomType),
  });
  if (!response.ok) {
    throw new Error('Failed to update room type');
  }
  return response.json();
};

const deleteRoomType = async (id) => {
  const response = await fetch(`/api/admin/room-type-management/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete room type');
  }
  return true;
};

export default function RoomTypeManagement() {
  const [roomTypes, setRoomTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentRoomType, setCurrentRoomType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);

  useEffect(() => {
    fetchRoomTypes()
      .then(setRoomTypes)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddRoomType = () => {
    setCurrentRoomType(null);
    setIsModalOpen(true);
  };

  const handleUpdateRoomType = (roomType) => {
    setCurrentRoomType(roomType);
    setIsModalOpen(true);
  };

  const handleDeleteRoomType = async (id) => {
    if (window.confirm('Are you sure you want to delete this room type?')) {
      setLoadingAction(id);
      try {
        await deleteRoomType(id);
        const updatedRoomTypes = await fetchRoomTypes();
        setRoomTypes(updatedRoomTypes);
        toast.success('Room type deleted successfully');
      } catch (err) {
        toast.error(err.message);
      } finally {
        setLoadingAction(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const roomTypeData = Object.fromEntries(formData.entries());
    setLoadingAction('form');

    try {
      if (currentRoomType) {
        await updateRoomType({ ...currentRoomType, ...roomTypeData });
        toast.success('Room type updated successfully');
      } else {
        await addRoomType(roomTypeData);
        toast.success('Room type added successfully');
      }
      const updatedRoomTypes = await fetchRoomTypes();
      setRoomTypes(updatedRoomTypes);
      setIsModalOpen(false);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div>
      <ToastContainer />
      <div className="p-6">
        <div className="mb-6 flex justify-between items-center">
          <Input type="text" placeholder="Search room types..." className="pl-10 w-auto" />
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddRoomType} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Room Type
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl h-[200px]">
              <DialogHeader>
                <DialogTitle>{currentRoomType ? 'Update Room Type' : 'Add Room Type'}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  {['title', 'description'].map((field) => (
                    <div key={field}>
                      <label htmlFor={field} className="block text-sm font-medium">
                        {field.charAt(0).toUpperCase() + field.slice(1)}
                      </label>
                      <Input
                        type="text"
                        name={field}
                        defaultValue={currentRoomType?.[field] || ''}
                      />
                    </div>
                  ))}
                </div>
                <Button type="submit" className="w-full" disabled={loadingAction === 'form'}>
                  {loadingAction === 'form' && <Loader className="mr-2 animate-spin" />}
                  {currentRoomType ? 'Update' : 'Add'} Room Type
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
                  <TableHead>Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {roomTypes.map((roomType, index) => (
                  <TableRow key={roomType.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{roomType.title}</TableCell>
                    <TableCell>{roomType.description}</TableCell>
                    <TableCell>
                      <Button onClick={() => handleUpdateRoomType(roomType)} variant="ghost">
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteRoomType(roomType.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === roomType.id}
                      >
                        {loadingAction === roomType.id ? (
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
