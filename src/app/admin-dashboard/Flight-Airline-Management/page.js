'use client';

import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/solid';
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
import { Loader } from 'lucide-react';
import 'react-toastify/dist/ReactToastify.css';

const IMAGE_UPLOAD_API = 'https://alhabib.m3xtrader.com/uploadImage.php';

const fetchAirlines = async () => {
  const response = await fetch('/api/admin/flight-airlines');
  if (!response.ok) {
    throw new Error('Failed to fetch airlines');
  }
  return response.json();
};

const addAirline = async (airline) => {
  const response = await fetch('/api/admin/flight-airlines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(airline),
  });
  if (!response.ok) {
    throw new Error('Failed to add airline');
  }
  return response.json();
};

const updateAirline = async (airline) => {
  const response = await fetch(`/api/admin/flight-airlines/${airline.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(airline),
  });
  if (!response.ok) {
    throw new Error('Failed to update airline');
  }
  return response.json();
};

const deleteAirline = async (id) => {
  const response = await fetch(`/api/admin/flight-airlines/${id}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
    throw new Error('Failed to delete airline');
  }
  return true;
};

const uploadImage = async (imageFile) => {
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  try {
    const base64Image = await convertToBase64(imageFile);

    const response = await fetch(IMAGE_UPLOAD_API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image }),
    });

    if (!response.ok) throw new Error('Failed to upload image');

    const data = await response.json();
    return data.image_url; // Adjust based on the API response format
  } catch (error) {
    throw new Error(error.message);
  }
};



export default function AirlineManagement() {
  const [airlines, setAirlines] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentAirline, setCurrentAirline] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAction, setLoadingAction] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    fetchAirlines()
      .then(setAirlines)
      .catch((err) => toast.error(err.message))
      .finally(() => setIsLoading(false));
  }, []);

  const handleAddAirline = () => {
    setCurrentAirline(null);
    setIsModalOpen(true);
  };

  const handleUpdateAirline = (airline) => {
    setCurrentAirline(airline);
    setIsModalOpen(true);
  };

  const handleDeleteAirline = async (id) => {
    if (window.confirm('Are you sure you want to delete this airline?')) {
      setLoadingAction(id);
      try {
        await deleteAirline(id);
        const updatedAirlines = await fetchAirlines();
        setAirlines(updatedAirlines);
        toast.success('Airline deleted successfully');
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
    const airlineData = Object.fromEntries(formData.entries());
    setLoadingAction('form');

    try {
      if (imageFile) {
        airlineData.image = await uploadImage(imageFile);
      }
      
      if (currentAirline) {
        await updateAirline({ ...currentAirline, ...airlineData });
        toast.success('Airline updated successfully');
      } else {
        await addAirline(airlineData);
        toast.success('Airline added successfully');
      }
      const updatedAirlines = await fetchAirlines();
      setAirlines(updatedAirlines);
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
          <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
            <DialogTrigger asChild>
              <Button onClick={handleAddAirline} className="bg-indigo-600">
                <PlusIcon className="h-5 w-5 mr-2" />
                Add Airline
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>
                  {currentAirline ? 'Update Airline' : 'Add Airline'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                      Name
                    </label>
                    <Input
                      type="text"
                      name="name"
                      defaultValue={currentAirline?.name || ''}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium">
                      Serial Number
                    </label>
                    <Input
                      type="text"
                      name="sn"
                      defaultValue={currentAirline?.sn || ''}
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="image" className="block text-sm font-medium">
                      Upload Image
                    </label>
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) => setImageFile(e.target.files[0])}
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loadingAction === 'form'}
                >
                  {loadingAction === 'form' && (
                    <Loader className="mr-2 animate-spin" />
                  )}
                  {currentAirline ? 'Update' : 'Add'} Airline
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
                  <TableHead>Serial Number</TableHead>
                  <TableHead>Image</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {airlines.map((airline, index) => (
                  <TableRow key={airline.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>{airline.name}</TableCell>
                    <TableCell>{airline.sn}</TableCell>
                    <TableCell>
                      <img
                        src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_PATH}/${airline.image}`}
                        alt={airline.name}
                        className="w-12 h-12 rounded"
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        onClick={() => handleUpdateAirline(airline)}
                        variant="ghost"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </Button>
                      <Button
                        onClick={() => handleDeleteAirline(airline.id)}
                        variant="ghost"
                        className="text-red-600"
                        disabled={loadingAction === airline.id}
                      >
                        {loadingAction === airline.id ? (
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
